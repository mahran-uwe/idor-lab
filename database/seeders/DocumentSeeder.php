<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /** @var Collection<int, User> $users */
        $users = User::query()
            ->whereIn('email', [
                'user.a@example.com',
                'user.b@example.com',
            ])
            ->orderBy('id')
            ->get();

        foreach ($users as $user) {

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
