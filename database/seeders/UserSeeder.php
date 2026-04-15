<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = ['User A', 'User B', 'Super Admin'];

        foreach ($users as $name) {
            $email = strtolower(str_replace(' ', '.', $name)).'@example.com';

            User::query()->firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make('password'),
                    'role' => $name === 'Super Admin' ? 'admin' : 'user',
                ],
            );
        }
    }
}
