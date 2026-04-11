<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = ['User A', 'User B', 'Super Admin'];
        foreach ($users as $user) {
            User::factory()->create([
                'name' => $user,
                'email' => strtolower(str_replace(' ', '.', $user)).'@example.com',
            ]);
        }
    }
}
