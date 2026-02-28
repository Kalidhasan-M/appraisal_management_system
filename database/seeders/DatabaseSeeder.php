<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            DepartmentSeeder::class,
            KpiTemplateSeeder::class,
        ]);

        $adminRole = Role::where('name', 'admin')->first();
        $managerRole = Role::where('name', 'manager')->first();
        $employeeRole = Role::where('name', 'employee')->first();
        $engineering = Department::where('name', 'Engineering')->first();
        $password = Hash::make('password');

        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => $password, 'role_id' => $adminRole->id, 'department_id' => $engineering?->id]
        );

        $manager = User::updateOrCreate(
            ['email' => 'manager@example.com'],
            ['name' => 'Manager User', 'password' => $password, 'role_id' => $managerRole->id, 'department_id' => $engineering?->id]
        );

        User::updateOrCreate(
            ['email' => 'employee@example.com'],
            ['name' => 'Employee User', 'password' => $password, 'role_id' => $employeeRole->id, 'department_id' => $engineering?->id, 'manager_id' => $manager->id]
        );
    }
}
