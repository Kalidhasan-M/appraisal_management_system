<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Engineering', 'description' => 'Software development and technical teams'],
            ['name' => 'HR', 'description' => 'Human resources and recruitment'],
            ['name' => 'Marketing', 'description' => 'Marketing and brand management'],
            ['name' => 'Sales', 'description' => 'Sales and business development'],
            ['name' => 'Finance', 'description' => 'Finance and accounting'],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(
                ['name' => $dept['name']],
                ['description' => $dept['description']]
            );
        }
    }
}
