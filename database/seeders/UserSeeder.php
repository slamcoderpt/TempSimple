<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Henrique Duarte',
            'email' => 'henrique.duarte@altronix.pt',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);
    }
} 