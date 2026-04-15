<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Inertia\Response;

class TestController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $validated = $request->validate([
            'run' => ['nullable', 'boolean'],
        ]);

        $shouldRun = (bool) ($validated['run'] ?? false);
        $result = null;

        if ($shouldRun) {
            $parameters = [
                '--without-tty' => true,
                '--no-interaction' => true,
            ];

            $originalWorkingDirectory = getcwd();

            if ($originalWorkingDirectory !== false) {
                chdir(base_path());
            }

            try {
                $exitCode = Artisan::call('test', $parameters);
            } finally {
                if ($originalWorkingDirectory !== false) {
                    chdir($originalWorkingDirectory);
                }
            }

            $output = Artisan::output();

            $result = [
                'exit_code' => $exitCode,
                'status' => $exitCode === 0 ? 'passed' : 'failed',
                'output' => $output,
                'tests' => $this->parseTestsFromOutput($output),
            ];
        }

        return Inertia::render('Tests/Index', [
            'result' => $result,
        ]);
    }

    /**
     * @return array<int, array{name: string, status: 'passed'|'failed', suite: string|null}>
     */
    private function parseTestsFromOutput(string $output): array
    {
        $lines = preg_split('/\R/', $output) ?: [];
        $tests = [];
        $currentSuite = null;

        foreach ($lines as $line) {
            $cleanLine = trim((string) preg_replace('/\e\[[\d;]*m/', '', $line));

            if ($cleanLine === '') {
                continue;
            }

            if (preg_match('/^(PASS|FAIL)\s+(.+)$/', $cleanLine, $suiteMatches) === 1) {
                $currentSuite = trim($suiteMatches[2]);

                continue;
            }

            if (preg_match('/^([✓✔⨯✗])\s+(.+)$/u', $cleanLine, $testMatches) !== 1) {
                continue;
            }

            $tests[] = [
                'name' => trim($testMatches[2]),
                'status' => in_array($testMatches[1], ['✓', '✔'], true) ? 'passed' : 'failed',
                'suite' => $currentSuite,
            ];
        }

        return $tests;
    }
}
