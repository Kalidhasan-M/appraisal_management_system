<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Appraisal;
use App\Models\AppraisalDocument;
use App\Models\KpiRating;
use App\Models\KpiTemplate;
use Barryvdh\DomPDF\Facade\Pdf as PdfFacade;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppraisalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appraisal::with(['user', 'kpiRatings.kpiTemplate', 'achievements', 'documents'])
            ->where('user_id', $request->user()->id);

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appraisals = $query->orderByDesc('year')->get();

        return response()->json($appraisals);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year' => ['required', 'integer', 'min:2020', 'max:2030'],
            'self_assessment' => ['nullable', 'string'],
            'kpi_ratings' => ['nullable', 'array'],
            'kpi_ratings.*.kpi_template_id' => ['required', 'exists:kpi_templates,id'],
            'kpi_ratings.*.rating' => ['required', 'integer', 'min:1', 'max:5'],
            'kpi_ratings.*.comments' => ['nullable', 'string'],
            'achievements' => ['nullable', 'array'],
            'achievements.*.title' => ['required', 'string'],
            'achievements.*.description' => ['nullable', 'string'],
            'achievements.*.date' => ['nullable', 'date'],
        ]);

        $existing = Appraisal::where('user_id', $request->user()->id)
            ->where('year', $validated['year'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Appraisal for this year already exists'], 422);
        }

        $appraisal = Appraisal::create([
            'user_id' => $request->user()->id,
            'year' => $validated['year'],
            'self_assessment' => $validated['self_assessment'] ?? null,
            'status' => 'draft',
        ]);

        if (!empty($validated['kpi_ratings'])) {
            foreach ($validated['kpi_ratings'] as $kr) {
                KpiRating::create([
                    'appraisal_id' => $appraisal->id,
                    'kpi_template_id' => $kr['kpi_template_id'],
                    'rating' => $kr['rating'],
                    'comments' => $kr['comments'] ?? null,
                ]);
            }
        }

        if (!empty($validated['achievements'])) {
            foreach ($validated['achievements'] as $ach) {
                Achievement::create([
                    'appraisal_id' => $appraisal->id,
                    'title' => $ach['title'],
                    'description' => $ach['description'] ?? null,
                    'date' => $ach['date'] ?? null,
                ]);
            }
        }

        $appraisal->load(['kpiRatings.kpiTemplate', 'achievements', 'documents']);

        return response()->json($appraisal, 201);
    }

    public function show(Request $request, Appraisal $appraisal): JsonResponse
    {
        if ($appraisal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appraisal->load(['user', 'kpiRatings.kpiTemplate', 'achievements', 'documents']);

        return response()->json($appraisal);
    }

    public function update(Request $request, Appraisal $appraisal): JsonResponse
    {
        if ($appraisal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$appraisal->canEdit()) {
            return response()->json(['message' => 'Appraisal cannot be edited'], 422);
        }

        $validated = $request->validate([
            'self_assessment' => ['nullable', 'string'],
            'kpi_ratings' => ['nullable', 'array'],
            'kpi_ratings.*.kpi_template_id' => ['required', 'exists:kpi_templates,id'],
            'kpi_ratings.*.rating' => ['required', 'integer', 'min:1', 'max:5'],
            'kpi_ratings.*.comments' => ['nullable', 'string'],
            'achievements' => ['nullable', 'array'],
            'achievements.*.id' => ['nullable', 'exists:achievements,id'],
            'achievements.*.title' => ['required', 'string'],
            'achievements.*.description' => ['nullable', 'string'],
            'achievements.*.date' => ['nullable', 'date'],
        ]);

        $appraisal->update(['self_assessment' => $validated['self_assessment'] ?? $appraisal->self_assessment]);

        if (isset($validated['kpi_ratings'])) {
            KpiRating::where('appraisal_id', $appraisal->id)->delete();
            foreach ($validated['kpi_ratings'] as $kr) {
                KpiRating::create([
                    'appraisal_id' => $appraisal->id,
                    'kpi_template_id' => $kr['kpi_template_id'],
                    'rating' => $kr['rating'],
                    'comments' => $kr['comments'] ?? null,
                ]);
            }
        }

        if (isset($validated['achievements'])) {
            $keepIds = collect($validated['achievements'])->pluck('id')->filter()->toArray();
            Achievement::where('appraisal_id', $appraisal->id)
                ->whereNotIn('id', $keepIds)
                ->delete();

            foreach ($validated['achievements'] as $ach) {
                if (!empty($ach['id'])) {
                    Achievement::where('id', $ach['id'])->update([
                        'title' => $ach['title'],
                        'description' => $ach['description'] ?? null,
                        'date' => $ach['date'] ?? null,
                    ]);
                } else {
                    Achievement::create([
                        'appraisal_id' => $appraisal->id,
                        'title' => $ach['title'],
                        'description' => $ach['description'] ?? null,
                        'date' => $ach['date'] ?? null,
                    ]);
                }
            }
        }

        $appraisal->load(['kpiRatings.kpiTemplate', 'achievements', 'documents']);

        return response()->json($appraisal);
    }

    public function destroy(Request $request, Appraisal $appraisal): JsonResponse
    {
        if ($appraisal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$appraisal->canEdit()) {
            return response()->json(['message' => 'Appraisal cannot be deleted'], 422);
        }

        $appraisal->delete();

        return response()->json(null, 204);
    }

    public function submit(Request $request, Appraisal $appraisal): JsonResponse
    {
        if ($appraisal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$appraisal->canSubmit()) {
            return response()->json(['message' => 'Appraisal cannot be submitted'], 422);
        }

        $appraisal->update(['status' => 'submitted']);

        return response()->json($appraisal->fresh()->load(['kpiRatings.kpiTemplate', 'achievements', 'documents']));
    }

    public function uploadDocument(Request $request, Appraisal $appraisal): JsonResponse
    {
        if ($appraisal->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$appraisal->canEdit()) {
            return response()->json(['message' => 'Cannot upload to this appraisal'], 422);
        }

        $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png'],
        ]);

        $file = $request->file('file');
        $path = $file->store('appraisals/' . $appraisal->id, 'public');

        $document = AppraisalDocument::create([
            'appraisal_id' => $appraisal->id,
            'name' => $file->hashName(),
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json($document, 201);
    }

    public function exportPdf(Request $request, Appraisal $appraisal)
    {
        if ($appraisal->user_id !== $request->user()->id && !$request->user()->hasAnyRole(['admin', 'manager'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$appraisal->isCompleted()) {
            return response()->json(['message' => 'Only completed appraisals can be exported'], 422);
        }

        $appraisal->load(['user.department', 'kpiRatings.kpiTemplate', 'achievements', 'documents', 'reviewer']);

        $pdf = PdfFacade::loadView('appraisal-pdf', compact('appraisal'));
        $pdf->setPaper('a4');

        return $pdf->download("appraisal-{$appraisal->user->name}-{$appraisal->year}.pdf");
    }
}
