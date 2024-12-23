<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Crear roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $teacherRole = Role::firstOrCreate(['name' => 'teacher']);

        // Crear permisos
        $permissions = [
            'view_all',
            'view_teacher_profile',
            'edit_teacher_profile',
            'view_activities',
            'manage_students',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Asignar permisos a los roles
        $adminRole->syncPermissions(['view_all']);

        $teacherRole->syncPermissions([
            'view_teacher_profile',
            'edit_teacher_profile',
            'view_activities',
            'manage_students',
        ]);
    }
}
