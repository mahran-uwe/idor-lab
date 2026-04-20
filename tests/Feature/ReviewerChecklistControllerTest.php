<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('authenticated users can view reviewer checklist page', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('reviewer-checklist.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('ReviewerChecklist/Index')
        ->has('rows', 8)
        ->where('rows.0.id', 'C1')
        ->where('rows.0.resource', 'Documents')
        ->where('rows.1.id', 'C2')
        ->where('rows.6.id', 'C7')
        ->where('rows.7.id', 'C8')
    );
});

test('guests are redirected away from reviewer checklist page', function () {
    $response = $this->get(route('reviewer-checklist.index'));

    $response->assertRedirect(route('login'));
});
