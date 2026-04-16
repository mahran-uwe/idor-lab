<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('authenticated users can view secure object references page', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('secure-object-references.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('SecureObjectReferences/Index')
        ->has('referencePatterns', 4)
        ->has('evidenceRows', 8)
        ->where('evidenceRows.2.endpoint', 'insecure.uuid.show')
        ->where('evidenceRows.2.actual', '200')
        ->where('evidenceRows.2.passFail', 'Fail')
        ->where('evidenceRows.3.endpoint', 'secure.uuid.show')
        ->where('evidenceRows.3.actual', '403')
        ->where('evidenceRows.3.passFail', 'Pass')
    );
});

test('guests are redirected away from secure object references page', function () {
    $response = $this->get(route('secure-object-references.index'));

    $response->assertRedirect(route('login'));
});
