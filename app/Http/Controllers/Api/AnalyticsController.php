<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appraisal;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $year = $request->get('year', now()->year);

        $totalEmployees = User::whereHas('role', fn ($q) => $q->where('name', 'employee'))->count();

        $pendingReviews = Appraisal::where('status', 'submitted')->count();

        if (!$user->isAdmin()) {
            $subordinateIds = $user->subordinates()->pluck('id');
            $pendingReviews = Appraisal::where('status', 'submitted')
                ->whereIn('user_id', $subordinateIds)
                ->count();
        }

        $completedThisYear = Appraisal::where('year', $year)
            ->whereIn('status', ['approved', 'rejected'])
            ->count();

        $draftCount = Appraisal::where('year', $year)->where('status', 'draft')->count();
        $submittedCount = Appraisal::where('year', $year)->where('status', 'submitted')->count();

        $departmentStats = Department::withCount(['users'])
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'name' => $d->name,
                'employee_count' => $d->users_count,
            ]);

        return response()->json([
            'total_employees' => $totalEmployees,
            'pending_reviews' => $pendingReviews,
            'completed_this_year' => $completedThisYear,
            'draft_count' => $draftCount,
            'submitted_count' => $submittedCount,
            'year' => (int) $year,
            'departments' => $departmentStats,
        ]);
    }
}
