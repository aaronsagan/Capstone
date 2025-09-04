<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'password' => Hash::make('password'), 'role' => 'admin']
        );

        // Donor
        User::firstOrCreate(
            ['email' => 'donor@example.com'],
            ['name' => 'Donor', 'password' => Hash::make('password'), 'role' => 'donor']
        );

        // Charity Admin
        User::firstOrCreate(
            ['email' => 'charityadmin@example.com'],
            ['name' => 'Charity Admin', 'password' => Hash::make('password'), 'role' => 'charity_admin']
        );
    }
}
