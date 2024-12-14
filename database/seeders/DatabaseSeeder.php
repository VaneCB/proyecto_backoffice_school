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
        User::create([
            'name' => 'Vanessa Carrera',
            'email' => 'vcarrerabcn@gmail.com',
            'password' => Hash::make('secret')
        ]);
        User::create([
            'name' => 'Admin',
            'email' => 'admin@school.com',
            'password' => Hash::make('admin')
        ]);
        User::create([
            'name' => 'Luna Lovegood',
            'email' => 'lunaticalove@gmail.com',
            'password' => Hash::make('teacher')
        ]);
    }
}
