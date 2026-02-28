<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kpi_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('weight')->default(1); // Weight for scoring
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpi_templates');
    }
};
