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
            'test_path' => ['nullable', 'string', 'max:255', 'regex:/^tests\/.+\.php$/'],
            'filter' => ['nullable', 'string', 'max:255'],
        ]);

        $shouldRun = (bool) ($validated['run'] ?? false);
        $testPath = $validated['test_path'] ?? null;
        $filter = $validated['filter'] ?? null;
        $result = null;

        if ($shouldRun) {
            $parameters = [
                '--compact' => true,
                '--without-tty' => true,
                '--no-interaction' => true,
            ];

            if (is_string($testPath) && $testPath !== '') {
                $parameters['test'] = $testPath;
            }

            if (is_string($filter) && $filter !== '') {
                $parameters['--filter'] = $filter;
            }

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

            $result = [
                'exit_code' => $exitCode,
                'status' => $exitCode === 0 ? 'passed' : 'failed',
                'output' => Artisan::output(),
            ];
        }

        return Inertia::render('Tests/Index', [
            'requestedPath' => $testPath,
            'requestedFilter' => $filter,
            'result' => $result,
        ]);
    }
}
