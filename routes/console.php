<?php

use App\Http\Controllers\Api\InsecureInvoiceController as ApiInsecureInvoiceController;
use App\Http\Controllers\Api\SecureInvoiceController as ApiSecureInvoiceController;
use App\Http\Controllers\InsecureDocumentController;
use App\Http\Controllers\InsecureInvoiceController;
use App\Http\Controllers\SecureDocumentController;
use App\Http\Controllers\SecureInvoiceController;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\User;
use Database\Seeders\DocumentSeeder;
use Database\Seeders\InvoiceItemSeeder;
use Database\Seeders\InvoiceSeeder;
use Database\Seeders\ProductSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('bench:prototype-auth {--iterations=1000}', function () {
    $iterations = max(1, (int) $this->option('iterations'));

    $this->components->info("Preparing deterministic seed data for {$iterations} iterations per implementation...");

    $this->callSilent('db:seed', [
        '--class' => UserSeeder::class,
        '--no-interaction' => true,
    ]);
    $this->callSilent('db:seed', [
        '--class' => DocumentSeeder::class,
        '--no-interaction' => true,
    ]);
    $this->callSilent('db:seed', [
        '--class' => ProductSeeder::class,
        '--no-interaction' => true,
    ]);
    $this->callSilent('db:seed', [
        '--class' => InvoiceSeeder::class,
        '--no-interaction' => true,
    ]);
    $this->callSilent('db:seed', [
        '--class' => InvoiceItemSeeder::class,
        '--no-interaction' => true,
    ]);

    $userA = User::query()->where('email', 'user.a@example.com')->firstOrFail();
    $userB = User::query()->where('email', 'user.b@example.com')->firstOrFail();

    $document = Document::query()->where('user_id', $userA->id)->orderBy('id')->firstOrFail();
    $invoice = Invoice::query()->where('user_id', $userA->id)->orderBy('id')->firstOrFail();

    if (! $document instanceof Document) {
        throw new RuntimeException('Expected seeded document model instance.');
    }

    if (! $invoice instanceof Invoice) {
        throw new RuntimeException('Expected seeded invoice model instance.');
    }

    $insecureDocumentController = app(InsecureDocumentController::class);
    $secureDocumentController = app(SecureDocumentController::class);
    $insecureInvoiceController = app(InsecureInvoiceController::class);
    $secureInvoiceController = app(SecureInvoiceController::class);
    $apiInsecureInvoiceController = app(ApiInsecureInvoiceController::class);
    $apiSecureInvoiceController = app(ApiSecureInvoiceController::class);

    $benchmarks = [
        [
            'pair' => 'Document ID Route',
            'route_insecure' => 'insecure.documents.show',
            'route_secure' => 'secure.documents.show',
            'insecure' => function () use ($insecureDocumentController, $document, $userA) {
                Auth::guard('web')->setUser($userA);
                app()->instance('request', Request::create('/insecure/documents/'.$document->id, 'GET'));

                return $insecureDocumentController->show($document);
            },
            'secure' => function () use ($secureDocumentController, $document, $userA) {
                Auth::guard('web')->setUser($userA);
                app()->instance('request', Request::create('/secure/documents/'.$document->id, 'GET'));

                return $secureDocumentController->show($document);
            },
        ],
        [
            'pair' => 'Document UUID Route',
            'route_insecure' => 'insecure.uuid.show',
            'route_secure' => 'secure.uuid.show',
            'insecure' => function () use ($insecureDocumentController, $document, $userA) {
                Auth::guard('web')->setUser($userA);

                $request = Request::create('/insecure/documents/uuid/'.$document->uuid, 'GET');
                $request->setRouteResolver(function () use ($document) {
                    return new class($document)
                    {
                        public function __construct(private Document $document) {}

                        public function parameter(string $key, mixed $default = null): mixed
                        {
                            return $key === 'uuid' ? $this->document->uuid : $default;
                        }
                    };
                });

                app()->instance('request', $request);

                return $insecureDocumentController->show($document);
            },
            'secure' => function () use ($secureDocumentController, $document, $userA) {
                Auth::guard('web')->setUser($userA);

                $request = Request::create('/secure/documents/uuid/'.$document->uuid, 'GET');
                $request->setRouteResolver(function () use ($document) {
                    return new class($document)
                    {
                        public function __construct(private Document $document) {}

                        public function parameter(string $key, mixed $default = null): mixed
                        {
                            return $key === 'uuid' ? $this->document->uuid : $default;
                        }
                    };
                });

                app()->instance('request', $request);

                return $secureDocumentController->show($document);
            },
        ],
        [
            'pair' => 'Invoice Web Route',
            'route_insecure' => 'insecure.invoices.show',
            'route_secure' => 'secure.invoices.show',
            'insecure' => function () use ($insecureInvoiceController, $invoice, $userA) {
                Auth::guard('web')->setUser($userA);
                app()->instance('request', Request::create('/insecure/invoices/'.$invoice->invoice_number, 'GET'));

                return $insecureInvoiceController->show($invoice);
            },
            'secure' => function () use ($secureInvoiceController, $invoice, $userA) {
                Auth::guard('web')->setUser($userA);
                app()->instance('request', Request::create('/secure/invoices/'.$invoice->invoice_number, 'GET'));

                return $secureInvoiceController->show($invoice);
            },
        ],
        [
            'pair' => 'Invoice API Route',
            'route_insecure' => 'api.insecure.invoices.show',
            'route_secure' => 'api.secure.invoices.show',
            'insecure' => function () use ($apiInsecureInvoiceController, $invoice, $userA) {
                Auth::guard('web')->setUser($userA);
                $request = Request::create('/api/insecure/invoices/'.$invoice->invoice_number, 'GET');
                app()->instance('request', $request);

                return $apiInsecureInvoiceController($request, $invoice);
            },
            'secure' => function () use ($apiSecureInvoiceController, $invoice, $userA) {
                Auth::guard('web')->setUser($userA);
                $request = Request::create('/api/secure/invoices/'.$invoice->invoice_number, 'GET');
                app()->instance('request', $request);

                return $apiSecureInvoiceController($request, $invoice);
            },
        ],
    ];

    $results = [];

    $computeStats = function (array $samples): array {
        sort($samples);
        $count = count($samples);
        $sum = array_sum($samples);
        $mean = $sum / $count;
        $median = $count % 2 === 0
            ? ($samples[($count / 2) - 1] + $samples[$count / 2]) / 2
            : $samples[(int) floor($count / 2)];
        $variance = array_sum(array_map(fn ($sample) => ($sample - $mean) ** 2, $samples)) / $count;

        $rank = fn (float $p) => $samples[max(0, min($count - 1, (int) ceil($p * $count) - 1))];

        return [
            'count' => $count,
            'mean_ms' => round($mean, 4),
            'median_ms' => round($median, 4),
            'min_ms' => round(min($samples), 4),
            'max_ms' => round(max($samples), 4),
            'stddev_ms' => round(sqrt($variance), 4),
            'p95_ms' => round($rank(0.95), 4),
            'p99_ms' => round($rank(0.99), 4),
        ];
    };

    $benchmarkCallable = function (callable $callback, int $iterations): array {
        $samples = [];
        $errors = 0;

        for ($i = 0; $i < $iterations; $i++) {
            $started = hrtime(true);

            try {
                $callback();
            } catch (Throwable) {
                $errors++;
            }

            $elapsedMs = (hrtime(true) - $started) / 1_000_000;
            $samples[] = $elapsedMs;
        }

        return [
            'samples' => $samples,
            'errors' => $errors,
        ];
    };

    foreach ($benchmarks as $benchmark) {
        $this->components->twoColumnDetail('Benchmarking pair', $benchmark['pair']);
        $this->components->twoColumnDetail('Routes', $benchmark['route_insecure'].' vs '.$benchmark['route_secure']);

        $insecureRun = $benchmarkCallable($benchmark['insecure'], $iterations);
        $secureRun = $benchmarkCallable($benchmark['secure'], $iterations);

        $insecureStats = $computeStats($insecureRun['samples']);
        $secureStats = $computeStats($secureRun['samples']);

        $results[] = [
            'pair' => $benchmark['pair'],
            'route_insecure' => $benchmark['route_insecure'],
            'route_secure' => $benchmark['route_secure'],
            'insecure' => [
                ...$insecureStats,
                'errors' => $insecureRun['errors'],
            ],
            'secure' => [
                ...$secureStats,
                'errors' => $secureRun['errors'],
            ],
        ];
    }

    $tableRows = [];

    foreach ($results as $result) {
        foreach (['insecure', 'secure'] as $implementation) {
            $stats = $result[$implementation];

            $tableRows[] = [
                $result['pair'],
                strtoupper($implementation),
                $stats['count'],
                $stats['errors'],
                $stats['mean_ms'],
                $stats['median_ms'],
                $stats['min_ms'],
                $stats['max_ms'],
                $stats['stddev_ms'],
                $stats['p95_ms'],
                $stats['p99_ms'],
            ];
        }
    }

    $this->newLine();
    $this->table(
        ['Pair', 'Impl', 'N', 'Errors', 'Mean(ms)', 'Median(ms)', 'Min(ms)', 'Max(ms)', 'StdDev(ms)', 'P95(ms)', 'P99(ms)'],
        $tableRows,
    );

    $directory = storage_path('app/benchmarks');

    if (! is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    $jsonPath = $directory.'/prototype_auth_benchmark.json';
    $csvPath = $directory.'/prototype_auth_benchmark.csv';

    file_put_contents($jsonPath, json_encode([
        'generated_at' => now()->toIso8601String(),
        'iterations' => $iterations,
        'seeded_users' => [
            'user_a' => $userA->email,
            'user_b' => $userB->email,
        ],
        'results' => $results,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    $csvHandle = fopen($csvPath, 'w');
    fputcsv($csvHandle, ['pair', 'implementation', 'count', 'errors', 'mean_ms', 'median_ms', 'min_ms', 'max_ms', 'stddev_ms', 'p95_ms', 'p99_ms']);

    foreach ($results as $result) {
        foreach (['insecure', 'secure'] as $implementation) {
            $stats = $result[$implementation];

            fputcsv($csvHandle, [
                $result['pair'],
                $implementation,
                $stats['count'],
                $stats['errors'],
                $stats['mean_ms'],
                $stats['median_ms'],
                $stats['min_ms'],
                $stats['max_ms'],
                $stats['stddev_ms'],
                $stats['p95_ms'],
                $stats['p99_ms'],
            ]);
        }
    }

    fclose($csvHandle);

    $this->newLine();
    $this->components->info('Benchmark artifacts saved:');
    $this->line("- JSON: {$jsonPath}");
    $this->line("- CSV:  {$csvPath}");
})->purpose('Benchmark insecure vs secure prototype implementations with statistical summaries');
