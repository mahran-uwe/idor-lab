<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Inertia\Response;

class BenchmarkController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $validated = $request->validate([
            'run' => ['nullable', 'boolean'],
            'iterations' => ['nullable', 'integer', 'min:10', 'max:10000'],
        ]);

        $shouldRun = (bool) ($validated['run'] ?? false);
        $iterations = (int) ($validated['iterations'] ?? 1000);
        $benchmark = $this->loadBenchmark();
        $runResult = null;

        if ($shouldRun) {
            $exitCode = Artisan::call('bench:prototype-auth', [
                '--iterations' => $iterations,
                '--no-interaction' => true,
            ]);

            $runResult = [
                'exit_code' => $exitCode,
                'status' => $exitCode === 0 ? 'passed' : 'failed',
                'iterations' => $iterations,
                'output' => Artisan::output(),
            ];

            $benchmark = $this->loadBenchmark();
        }

        return Inertia::render('Benchmarks/Index', [
            'benchmark' => $benchmark,
            'runResult' => $runResult,
        ]);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function loadBenchmark(): ?array
    {
        $jsonPath = storage_path('app/benchmarks/prototype_auth_benchmark.json');

        if (! is_file($jsonPath)) {
            return null;
        }

        $contents = file_get_contents($jsonPath);

        if ($contents === false) {
            return null;
        }

        $decoded = json_decode($contents, true);

        if (! is_array($decoded)) {
            return null;
        }

        return $decoded;
    }
}
