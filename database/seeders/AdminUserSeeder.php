<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'c.d.f.a@hotmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('admin123'), // You should change this password after first login
        ]);
    }
}
