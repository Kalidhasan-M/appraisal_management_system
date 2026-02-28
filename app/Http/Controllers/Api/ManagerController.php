<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appraisal;
use App\Models\KpiRating;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ManagerController extends Controller
{
    public function teamAppraisals(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $query = Appraisal::with(['user.department', 'kpiRatings.kpiTemplate', 'achievements']);
        } else {
            $subordinateIds = $user->subordinates()->pluck('id');
            $query = Appraisal::with(['user.department', 'kpiRatings.kpiTemplate', 'achievements'])
                ->whereIn('user_id', $subordinateIds);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        $appraisals = $query->orderByDesc('updated_at')->get();

        return response()->json($appraisals);
    }

    public function review(Request $request, Appraisal $appraisal): JsonResponse
    {
        $user = $request->user();

        $canReview = $user->isAdmin() || $appraisal->user->manager_id === $user->id;
        if (!$canReview) {
            return response()->json(['message' => 'Unauthorized to review this appraisal'], 403);
        }

        if (!$appraisal->canReview()) {
            return response()->json(['message' => 'Appraisal cannot be reviewed'], 422);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:approved,rejected,under_review'],
            'manager_comments' => ['nullable', 'string'],
            'manager_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'kpi_ratings' => ['nullable', 'array'],
            'kpi_ratings.*.kpi_rating_id' => ['required', 'exists:kpi_ratings,id'],
            'kpi_ratings.*.manager_rating' => ['required', 'integer', 'min:1', 'max:5'],
            'kpi_ratings.*.manager_comments' => ['nullable', 'string'],
        ]);

        $appraisal->update([
            'status' => $validated['status'],
            'manager_comments' => $validated['manager_comments'] ?? $appraisal->manager_comments,
            'manager_rating' => $validated['manager_rating'] ?? $appraisal->manager_rating,
            'reviewed_by' => $user->id,
            'reviewed_at' => in_array($validated['status'], ['approved', 'rejected']) ? now() : null,
        ]);

        if (!empty($validated['kpi_ratings'])) {
            foreach ($validated['kpi_ratings'] as $kr) {
                KpiRating::where('id', $kr['kpi_rating_id'])
                    ->where('appraisal_id', $appraisal->id)
                    ->update([
                        'manager_rating' => $kr['manager_rating'],
                        'manager_comments' => $kr['manager_comments'] ?? null,
                    ]);
            }
        }

        return response()->json($appraisal->fresh()->load(['user', 'kpiRatings.kpiTemplate', 'achievements', 'reviewer']));
    }
}
