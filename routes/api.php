<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/user', [App\Http\Controllers\Api\AuthController::class, 'user']);

    // Appraisals
    Route::apiResource('appraisals', App\Http\Controllers\Api\AppraisalController::class);
    Route::post('/appraisals/{appraisal}/submit', [App\Http\Controllers\Api\AppraisalController::class, 'submit']);
    Route::get('/appraisals/{appraisal}/export-pdf', [App\Http\Controllers\Api\AppraisalController::class, 'exportPdf']);
    Route::post('/appraisals/{appraisal}/upload', [App\Http\Controllers\Api\AppraisalController::class, 'uploadDocument']);

    // KPI Templates (read for all, write for admin)
    Route::get('/kpi-templates', [App\Http\Controllers\Api\KpiTemplateController::class, 'index']);
    Route::apiResource('kpi-templates', App\Http\Controllers\Api\KpiTemplateController::class)->except(['index'])->middleware('role:admin');

    // Departments (read for all, write for admin)
    Route::get('/departments', [App\Http\Controllers\Api\DepartmentController::class, 'index']);
    Route::apiResource('departments', App\Http\Controllers\Api\DepartmentController::class)->except(['index'])->middleware('role:admin');

    // Users (admin)
    Route::apiResource('users', App\Http\Controllers\Api\UserController::class)->middleware('role:admin');
    Route::post('/users/{user}/assign-role', [App\Http\Controllers\Api\UserController::class, 'assignRole'])->middleware('role:admin');

    // Manager routes
    Route::get('/manager/team-appraisals', [App\Http\Controllers\Api\ManagerController::class, 'teamAppraisals'])->middleware('role:manager,admin');
    Route::post('/manager/appraisals/{appraisal}/review', [App\Http\Controllers\Api\ManagerController::class, 'review'])->middleware('role:manager,admin');

    // Analytics (admin/manager)
    Route::get('/analytics', [App\Http\Controllers\Api\AnalyticsController::class, 'index'])->middleware('role:admin,manager');
});
