<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('authenticated users can view enforcement points page', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('enforcement-points.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('EnforcementPoints/Index')
    );
});

test('guests are redirected away from enforcement points page', function () {
    $response = $this->get(route('enforcement-points.index'));

    $response->assertRedirect(route('login'));
});
