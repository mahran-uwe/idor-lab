<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

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
            $result = $this->runTestsSafely();
            $this->storeResultSafely($result);

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
     * @return array{exit_code: int, status: 'passed'|'failed', output: string, tests: array<int, array{name: string, status: 'passed'|'failed', suite: string|null}>}
     */
    private function runTestsSafely(): array
    {
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
            $output = Artisan::output();
        } catch (Throwable $exception) {
            report($exception);

            $output = sprintf(
                'Unable to run automated tests. %s',
                $exception->getMessage()
            );

            return [
                'exit_code' => 1,
                'status' => 'failed',
                'output' => $output,
                'tests' => [],
            ];
        } finally {
            if ($originalWorkingDirectory !== false) {
                chdir($originalWorkingDirectory);
            }
        }

        return [
            'exit_code' => $exitCode,
            'status' => $exitCode === 0 ? 'passed' : 'failed',
            'output' => $output,
            'tests' => $this->parseTestsFromOutput($output),
        ];
    }

    /**
     * @param  array{exit_code: int, status: 'passed'|'failed', output: string, tests: array<int, array{name: string, status: 'passed'|'failed', suite: string|null}>}  $result
     */
    private function storeResultSafely(array $result): void
    {
        $encodedResult = json_encode($result, JSON_PRETTY_PRINT);
        if ($encodedResult === false) {
            report(new RuntimeException('Unable to encode test run result as JSON.'));

            return;
        }

        try {
            $wasStored = Storage::disk('local')->put(self::RESULT_FILE_PATH, $encodedResult);

            if ($wasStored !== true) {
                report(new RuntimeException('Unable to persist test run result.'));
            }
        } catch (Throwable $exception) {
            report($exception);
        }
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
