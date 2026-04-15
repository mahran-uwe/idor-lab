<?php

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('users can view insecure documents they do not own via id route', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $document = new Document;
    $document->user_id = $owner->id;
    $document->uuid = (string) Str::uuid();
    $document->title = 'Owner Document';
    $document->path = base_path('composer.json');
    $document->save();

    $response = $this
        ->actingAs($intruder)
        ->get(route('insecure.documents.show', $document));

    $response->assertOk();
});

test('users can view insecure documents they do not own via uuid route', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $document = new Document;
    $document->user_id = $owner->id;
    $document->uuid = (string) Str::uuid();
    $document->title = 'Owner UUID Document';
    $document->path = base_path('composer.json');
    $document->save();

    $response = $this
        ->actingAs($intruder)
        ->get(route('insecure.uuid.show', ['uuid' => $document->uuid]));

    $response->assertOk();
});
