<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $user1 = User::firstOrCreate(
            ['email' => 'vcarrerabcn@gmail.com'],
            [
                'name' => 'Vanessa Carrera',
                'password' => Hash::make('secret')
            ]
        );

        $user2 = User::firstOrCreate(
            ['email' => 'admin@school.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin')
            ]
        );

        $user3 = User::firstOrCreate(
            ['email' => 'lunaticalove@gmail.com'],
            [
                'name' => 'Luna Lovegood',
                'password' => Hash::make('teacher')
            ]
        );

        // Asignar roles
        if (!$user1->hasRole('admin')) {
            $user1->assignRole('admin');
        }

        if (!$user2->hasRole('admin')) {
            $user2->assignRole('admin');
        }

        if (!$user3->hasRole('teacher')) {
            $user3->assignRole('teacher');
        }

    }

}
