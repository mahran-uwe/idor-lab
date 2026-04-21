<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestController extends Controller
{
    private const RESULT_FILE_PATH = 'test-results/latest.json';

    public function __invoke(Request $request): Response|RedirectResponse
    {
        $validated = $request->validate([
            'run' => ['nullable', 'boolean'],
        ]);

        $shouldRun = (bool) ($validated['run'] ?? false);
        if ($shouldRun) {
            $processResult = Process::path(base_path())
                ->timeout(300)
                ->run([
                    PHP_BINARY,
                    'artisan',
                    'test',
                    '--without-tty',
                    '--no-interaction',
                ]);

            $exitCode = $processResult->exitCode();

            $output = $processResult->output();
            if ($processResult->errorOutput() !== '') {
                $output = trim($output.PHP_EOL.$processResult->errorOutput());
            }

            $result = [
                'exit_code' => $exitCode,
                'status' => $exitCode === 0 ? 'passed' : 'failed',
                'output' => $output,
                'tests' => $this->parseTestsFromOutput($output),
            ];

            Storage::disk('local')->put(self::RESULT_FILE_PATH, json_encode($result, JSON_PRETTY_PRINT));

            return to_route('tests.index');
        }

        $storedResult = null;
        if (Storage::disk('local')->exists(self::RESULT_FILE_PATH)) {
            $decodedResult = json_decode((string) Storage::disk('local')->get(self::RESULT_FILE_PATH), true);

            if (is_array($decodedResult)) {
                $storedResult = $decodedResult;
            }
        }

        return Inertia::render('Tests/Index', [
            'result' => $storedResult,
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
