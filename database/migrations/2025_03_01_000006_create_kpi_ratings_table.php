<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kpi_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appraisal_id')->constrained()->cascadeOnDelete();
            $table->foreignId('kpi_template_id')->constrained()->cascadeOnDelete();
            $table->integer('rating'); // 1-5
            $table->text('comments')->nullable();
            $table->integer('manager_rating')->nullable();
            $table->text('manager_comments')->nullable();
            $table->timestamps();

            $table->unique(['appraisal_id', 'kpi_template_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpi_ratings');
    }
};
