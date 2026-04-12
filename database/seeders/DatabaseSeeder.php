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
            $user = User::factory()->create([
                'name' => $user,
                'email' => strtolower(str_replace(' ', '.', $user)).'@example.com',
            ]);

            $user->documents()->createMany([
                [
                    'title' => 'Document 1 for '.$user->name,
                    'path' => storage_path('app/demo/documents/Sample Document.pdf'),
                ],
                [
                    'title' => 'Document 2 for '.$user->name,
                    'path' => storage_path('app/demo/documents/Sample Document.pdf'),
                ],
            ]);
        }
    }
}
