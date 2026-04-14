<?php

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('secure document response disables browser caching', function () {
    $user = User::factory()->create();

    $document = new Document;
    $document->user_id = $user->id;
    $document->title = 'Sensitive Document';
    $document->path = base_path('composer.json');
    $document->save();

    $response = $this
        ->actingAs($user)
        ->get(route('secure.documents.show', $document));

    $cacheControl = strtolower((string) $response->headers->get('Cache-Control'));

    $response->assertOk();
    expect($cacheControl)->toContain('no-store');
    expect($cacheControl)->toContain('no-cache');
    expect($cacheControl)->toContain('must-revalidate');
    expect($cacheControl)->toContain('private');
    expect($cacheControl)->toContain('max-age=0');
    $response->assertHeader('Pragma', 'no-cache');
    $response->assertHeader('Expires', '0');
});

test('users cannot view secure documents they do not own', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $document = new Document;
    $document->user_id = $owner->id;
    $document->title = 'Owner Only Document';
    $document->path = base_path('composer.json');
    $document->save();

    $response = $this
        ->actingAs($intruder)
        ->get(route('secure.documents.show', $document));

    $response->assertForbidden();
});
