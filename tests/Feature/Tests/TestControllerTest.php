<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('authenticated users can view the test runner page', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('tests.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Tests/Index')
        ->where('result', null)
    );
});

test('test runner executes artisan test command and returns output', function () {
    $user = User::factory()->create();

    Artisan::shouldReceive('call')
        ->once()
        ->with('test', [
            '--compact' => true,
            '--without-tty' => true,
            '--no-interaction' => true,
            'test' => 'tests/Unit/ExampleTest.php',
            '--filter' => 'invoice',
        ])
        ->andReturn(1);

    Artisan::shouldReceive('output')
        ->once()
        ->andReturn('Simulated test output');

    $response = $this
        ->actingAs($user)
        ->get(route('tests.index', [
            'run' => 1,
            'test_path' => 'tests/Unit/ExampleTest.php',
            'filter' => 'invoice',
        ]));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Tests/Index')
        ->where('requestedPath', 'tests/Unit/ExampleTest.php')
        ->where('requestedFilter', 'invoice')
        ->where('result.exit_code', 1)
        ->where('result.status', 'failed')
        ->where('result.output', 'Simulated test output')
    );
});
