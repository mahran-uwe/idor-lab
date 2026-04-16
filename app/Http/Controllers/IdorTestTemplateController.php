<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Routing\Route;
use Inertia\Inertia;
use Inertia\Response;

class IdorTestTemplateController extends Controller
{
    /** @var array<string, string> */
    private const EMAIL_BY_SCENARIO_KEY = [
        'owner_user' => 'user.a@example.com',
        'other_user' => 'user.b@example.com',
        'admin_user' => 'super.admin@example.com',
    ];

    /** @var array<string, string> */
    private const EMAIL_BY_OBJECT_CASE = [
        'User A' => 'user.a@example.com',
        'User B' => 'user.b@example.com',
        'Admin' => 'super.admin@example.com',
    ];

    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('IdorTestTemplate/Index', [
            'rows' => $this->buildRows(),
        ]);
    }

    /**
     * @return array<int, array{
     *     testId: string,
     *     endpoint: string,
     *     userRole: string,
     *     object: string,
     *     expectedResult: string,
     *     actualResult: string,
     *     passFail: string,
     *     severity: string,
     *     evidenceNotes: string
     * }>
     */
    private function buildRows(): array
    {
        /** @var array<int, array{
         *     key: string,
         *     route_name: string,
         *     resource: string,
         *     object_reference: string,
         *     enforcement: string,
         *     notes: string,
         *     expected_by_scenario: array<string, string>,
         *     severity_by_scenario: array<string, string>
         * }> $endpointDefinitions
         */
        $endpointDefinitions = config('idor_test_template.endpoint_definitions', []);

        /** @var array<int, array{
         *     key: string,
         *     user_role: string,
         *     object_case: string
         * }> $scenarioDefinitions
         */
        $scenarioDefinitions = config('idor_test_template.user_scenarios', []);

        /** @var array<string, array{actual_result?: string, pass_fail?: string}> $recordedResults */
        $recordedResults = config('idor_test_template.recorded_results', []);

        $routes = app('router')->getRoutes();
        $rows = [];
        $nextId = 1;

        foreach ($endpointDefinitions as $endpointDefinition) {
            $route = $routes->getByName($endpointDefinition['route_name']);

            if (! $route instanceof Route) {
                continue;
            }

            foreach ($scenarioDefinitions as $scenarioDefinition) {
                $rowKey = $endpointDefinition['key'].'.'.$scenarioDefinition['key'];
                $recordedResult = $recordedResults[$rowKey] ?? [];

                $rows[] = [
                    'testId' => sprintf('T%02d', $nextId++),
                    'endpoint' => $this->formatEndpoint($route, $endpointDefinition, $scenarioDefinition),
                    'userRole' => $scenarioDefinition['user_role'],
                    'object' => $endpointDefinition['object_reference'],
                    'expectedResult' => $endpointDefinition['expected_by_scenario'][$scenarioDefinition['key']] ?? 'TBD',
                    'actualResult' => $recordedResult['actual_result'] ?? '',
                    'passFail' => $recordedResult['pass_fail'] ?? 'Pending',
                    'severity' => $endpointDefinition['severity_by_scenario'][$scenarioDefinition['key']] ?? 'Medium',
                    'evidenceNotes' => $endpointDefinition['notes'],
                ];
            }
        }

        return $rows;
    }

    /**
     * @param  array{key: string, object_reference: string}  $endpointDefinition
     * @param  array{key: string, object_case: string}  $scenarioDefinition
     */
    private function formatEndpoint(Route $route, array $endpointDefinition, array $scenarioDefinition): string
    {
        $methods = array_values(array_filter($route->methods(), fn (string $method) => $method !== 'HEAD'));
        $primaryMethod = $methods[0] ?? 'GET';

        $parameterValues = $this->resolveRouteParameterValues($endpointDefinition, $scenarioDefinition);
        $resolvedUri = preg_replace_callback(
            '/\{([^}:?]+)(?::[^}]+)?\??\}/',
            function (array $matches) use ($parameterValues): string {
                $parameterName = $matches[1];

                if (! array_key_exists($parameterName, $parameterValues)) {
                    return $matches[0];
                }

                return (string) $parameterValues[$parameterName];
            },
            $route->uri(),
        );

        if (! is_string($resolvedUri)) {
            $resolvedUri = $route->uri();
        }

        return sprintf('%s /%s', $primaryMethod, ltrim($resolvedUri, '/'));
    }

    /**
     * @param  array{key: string, object_reference: string}  $endpointDefinition
     * @param  array{key: string, object_case: string}  $scenarioDefinition
     * @return array<string, string|int>
     */
    private function resolveRouteParameterValues(array $endpointDefinition, array $scenarioDefinition): array
    {
        $targetUser = $this->resolveTargetUser($scenarioDefinition);

        if (! $targetUser instanceof User) {
            return [];
        }

        if ($endpointDefinition['object_reference'] === 'document') {
            $document = $this->resolveFirstDocumentForUser($targetUser->id);

            if (! $document instanceof Document) {
                return [];
            }

            if (str_contains($endpointDefinition['key'], 'uuid')) {
                return ['uuid' => $document->uuid];
            }

            return ['document' => $document->id];
        }

        if ($endpointDefinition['object_reference'] === 'invoice') {
            $invoice = $this->resolveFirstInvoiceForUser($targetUser->id);

            if (! $invoice instanceof Invoice) {
                return [];
            }

            return ['invoice' => $invoice->invoice_number];
        }

        return [];
    }

    /**
     * @param  array{key: string, object_case: string}  $scenarioDefinition
     */
    private function resolveTargetUser(array $scenarioDefinition): ?User
    {
        $targetEmail = $scenarioDefinition['object_case'] === 'own'
            ? self::EMAIL_BY_SCENARIO_KEY[$scenarioDefinition['key']] ?? null
            : self::EMAIL_BY_OBJECT_CASE[$scenarioDefinition['object_case']] ?? null;

        if (! is_string($targetEmail)) {
            return null;
        }

        $usersByEmail = $this->resolveDemoUsersByEmail();
        $user = $usersByEmail[$targetEmail] ?? null;

        return $user instanceof User ? $user : null;
    }

    private function resolveFirstDocumentForUser(int $userId): ?Document
    {
        static $documentsByUserId = null;

        if (! is_array($documentsByUserId)) {
            $documentsByUserId = Document::query()
                ->orderBy('id')
                ->get()
                ->unique('user_id')
                ->keyBy('user_id')
                ->all();
        }

        $document = $documentsByUserId[$userId] ?? null;

        return $document instanceof Document ? $document : null;
    }

    private function resolveFirstInvoiceForUser(int $userId): ?Invoice
    {
        static $invoicesByUserId = null;

        if (! is_array($invoicesByUserId)) {
            $invoicesByUserId = Invoice::query()
                ->orderBy('id')
                ->get()
                ->unique('user_id')
                ->keyBy('user_id')
                ->all();
        }

        $invoice = $invoicesByUserId[$userId] ?? null;

        return $invoice instanceof Invoice ? $invoice : null;
    }

    /**
     * @return array<string, User>
     */
    private function resolveDemoUsersByEmail(): array
    {
        static $usersByEmail = null;

        if (! is_array($usersByEmail)) {
            $usersByEmail = User::query()
                ->whereIn('email', [
                    'user.a@example.com',
                    'user.b@example.com',
                    'super.admin@example.com',
                ])
                ->get()
                ->keyBy('email')
                ->all();
        }

        return $usersByEmail;
    }
}
