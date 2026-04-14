<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = ['User A', 'User B', 'Super Admin'];

        foreach ($users as $name) {
            $email = strtolower(str_replace(' ', '.', $name)).'@example.com';

            $user = User::query()->firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make('password'),
                ],
            );

            $user->documents()->updateOrCreate(
                ['title' => 'Document 1 for '.$user->name],
                ['path' => storage_path('app/demo/documents/Sample Document.pdf')],
            );

            $user->documents()->updateOrCreate(
                ['title' => 'Document 2 for '.$user->name],
                ['path' => storage_path('app/demo/documents/Sample Document.pdf')],
            );
        }
    }
}
