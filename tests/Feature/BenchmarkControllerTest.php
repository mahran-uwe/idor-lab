<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('authenticated users can view benchmark dashboard', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('benchmarks.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Benchmarks/Index')
        ->where('runResult', null)
    );
});

test('benchmark dashboard executes benchmark command and returns data', function () {
    $user = User::factory()->create();

    $directory = storage_path('app/benchmarks');

    if (! is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    $payload = [
        'generated_at' => '2026-04-15T00:00:00+00:00',
        'iterations' => 500,
        'results' => [
            [
                'pair' => 'Document ID Route',
                'route_insecure' => 'insecure.documents.show',
                'route_secure' => 'secure.documents.show',
                'insecure' => [
                    'count' => 500,
                    'errors' => 0,
                    'mean_ms' => 0.1,
                    'median_ms' => 0.08,
                    'min_ms' => 0.05,
                    'max_ms' => 0.5,
                    'stddev_ms' => 0.03,
                    'p95_ms' => 0.2,
                    'p99_ms' => 0.3,
                ],
                'secure' => [
                    'count' => 500,
                    'errors' => 0,
                    'mean_ms' => 0.2,
                    'median_ms' => 0.18,
                    'min_ms' => 0.07,
                    'max_ms' => 0.6,
                    'stddev_ms' => 0.05,
                    'p95_ms' => 0.3,
                    'p99_ms' => 0.4,
                ],
            ],
        ],
    ];

    file_put_contents(
        $directory.'/prototype_auth_benchmark.json',
        json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
    );

    Artisan::shouldReceive('call')
        ->once()
        ->with('bench:prototype-auth', [
            '--iterations' => 500,
            '--no-interaction' => true,
        ])
        ->andReturn(0);

    Artisan::shouldReceive('output')
        ->once()
        ->andReturn('Benchmark completed');

    $response = $this
        ->actingAs($user)
        ->get(route('benchmarks.index', [
            'run' => 1,
            'iterations' => 500,
        ]));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('Benchmarks/Index')
        ->where('runResult.exit_code', 0)
        ->where('runResult.status', 'passed')
        ->where('runResult.iterations', 500)
        ->where('benchmark.generated_at', '2026-04-15T00:00:00+00:00')
        ->where('benchmark.iterations', 500)
        ->where('benchmark.results.0.pair', 'Document ID Route')
    );
});

test('guests are redirected away from benchmark dashboard', function () {
    $response = $this->get(route('benchmarks.index'));

    $response->assertRedirect(route('login'));
});
