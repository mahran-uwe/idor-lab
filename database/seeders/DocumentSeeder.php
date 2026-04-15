<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

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

        $firstSeededId = 101;
        $lastSeededId = $firstSeededId + ($users->count() * 2) - 1;

        Document::query()
            ->whereBetween('id', [$firstSeededId, $lastSeededId])
            ->delete();

        foreach ($users as $userIndex => $user) {
            $firstDocumentId = $firstSeededId + ($userIndex * 2);
            $secondDocumentId = $firstDocumentId + 1;

            $user->documents()->updateOrCreate(
                ['id' => $firstDocumentId],
                [
                    'title' => 'Document 1',
                    'path' => storage_path('app/demo/documents/Sample Document.pdf'),
                ],
            );

            $user->documents()->updateOrCreate(
                ['id' => $secondDocumentId],
                [
                    'title' => 'Document 2',
                    'path' => storage_path('app/demo/documents/Sample Document.pdf'),
                ],
            );
        }
    }
}
