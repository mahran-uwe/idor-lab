<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('authenticated users can view authorization model page', function () {
    $viewer = User::factory()->create();

    $response = $this
        ->actingAs($viewer)
        ->get(route('authorization-model.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('AuthorizationModel/Index')
        ->has('rows', 6)
        ->where('rows.0.resource', 'Document')
        ->where('rows.0.default', 'Deny')
        ->where('rows.1.resource', 'Document')
        ->where('rows.1.default', 'Allow')
        ->where('rows.4.resource', 'Invoice API Endpoint')
        ->where('rows.4.default', 'Deny')
        ->where('rows.5.default', 'Allow')
    );
});

test('guests are redirected away from authorization model page', function () {
    $response = $this->get(route('authorization-model.index'));

    $response->assertRedirect(route('login'));
});
