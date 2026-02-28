<?php

namespace Database\Seeders;

use App\Models\KpiTemplate;
use Illuminate\Database\Seeder;

class KpiTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $kpis = [
            ['name' => 'Quality of Work', 'description' => 'Accuracy, thoroughness, and attention to detail', 'weight' => 20],
            ['name' => 'Productivity', 'description' => 'Output and efficiency in completing tasks', 'weight' => 20],
            ['name' => 'Communication', 'description' => 'Clarity, effectiveness, and professionalism', 'weight' => 15],
            ['name' => 'Team Collaboration', 'description' => 'Working effectively with colleagues', 'weight' => 15],
            ['name' => 'Initiative & Innovation', 'description' => 'Proactive problem-solving and creativity', 'weight' => 15],
            ['name' => 'Attendance & Punctuality', 'description' => 'Reliability and timeliness', 'weight' => 10],
            ['name' => 'Professional Development', 'description' => 'Growth and skill enhancement', 'weight' => 5],
        ];

        foreach ($kpis as $kpi) {
            KpiTemplate::firstOrCreate(
                ['name' => $kpi['name']],
                ['description' => $kpi['description'], 'weight' => $kpi['weight']]
            );
        }
    }
}
