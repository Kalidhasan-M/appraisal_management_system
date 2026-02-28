<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KpiTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KpiTemplateController extends Controller
{
    public function index(): JsonResponse
    {
        $templates = KpiTemplate::orderBy('weight', 'desc')->get();
        return response()->json($templates);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'weight' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $template = KpiTemplate::create($validated);
        return response()->json($template, 201);
    }

    public function show(KpiTemplate $kpiTemplate): JsonResponse
    {
        return response()->json($kpiTemplate);
    }

    public function update(Request $request, KpiTemplate $kpiTemplate): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'weight' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $kpiTemplate->update($validated);
        return response()->json($kpiTemplate);
    }

    public function destroy(KpiTemplate $kpiTemplate): JsonResponse
    {
        $kpiTemplate->delete();
        return response()->json(null, 204);
    }
}
