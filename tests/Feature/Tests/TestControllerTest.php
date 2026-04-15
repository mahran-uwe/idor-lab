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
    $simulatedOutput = "PASS  Tests\\Unit\\ExampleTest\n  ✓ that true is true\nFAIL  Tests\\Feature\\Invoices\\SecureInvoiceControllerTest\n  ⨯ users cannot view secure invoices they do not own\n";

    Artisan::shouldReceive('call')
        ->once()
        ->with('test', [
            '--without-tty' => true,
            '--no-interaction' => true,
        ])
        ->andReturn(1);

    Artisan::shouldReceive('output')
        ->once()
        ->andReturn($simulatedOutput);

    $response = $this
        ->actingAs($user)
        ->get(route('tests.index', [
            'run' => 1,
        ]));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Tests/Index')
        ->where('result.exit_code', 1)
        ->where('result.status', 'failed')
        ->where('result.output', $simulatedOutput)
        ->has('result.tests', 2)
        ->where('result.tests.0.name', 'that true is true')
        ->where('result.tests.0.status', 'passed')
        ->where('result.tests.0.suite', 'Tests\\Unit\\ExampleTest')
        ->where('result.tests.1.name', 'users cannot view secure invoices they do not own')
        ->where('result.tests.1.status', 'failed')
        ->where('result.tests.1.suite', 'Tests\\Feature\\Invoices\\SecureInvoiceControllerTest')
    );
});
