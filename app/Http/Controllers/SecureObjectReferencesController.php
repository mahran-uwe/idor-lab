<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SecureObjectReferencesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('SecureObjectReferences/Index', [
            'referencePatterns' => $this->referencePatterns(),
            'evidenceRows' => $this->evidenceRows(),
        ]);
    }

    /**
     * @return array<int, array{
     *     referenceType: string,
     *     route: string,
     *     binding: string,
     *     policy: string,
     *     helps: string,
     *     aloneEnough: bool
     * }>
     */
    private function referencePatterns(): array
    {
        return [
            [
                'referenceType' => 'id',
                'route' => 'GET /secure/documents/{document}',
                'binding' => 'Document by ID',
                'policy' => 'DocumentPolicy',
                'helps' => 'Simple direct lookup',
                'aloneEnough' => false,
            ],
            [
                'referenceType' => 'invoice_number',
                'route' => 'GET /secure/invoices/{invoice_number}',
                'binding' => 'Invoice by scoped route key',
                'policy' => 'InvoicePolicy',
                'helps' => 'Business-safe external key',
                'aloneEnough' => false,
            ],

            [
                'referenceType' => 'uuid',
                'route' => 'GET /secure/documents/uuid/{uuid}',
                'binding' => 'Document by UUID',
                'policy' => 'DocumentPolicy',
                'helps' => 'Obscure reference value',
                'aloneEnough' => false,
            ],
            [
                'referenceType' => 'invoice_number (API)',
                'route' => 'GET /api/secure/invoices/{invoice_number}',
                'binding' => 'Invoice by scoped route key',
                'policy' => 'InvoicePolicy',
                'helps' => 'Business-safe external key',
                'aloneEnough' => false,
            ],
        ];
    }

    /**
     * @return array<int, array{
     *     endpoint: string,
     *     reference: string,
     *     expected: string,
     *     actual: string,
     *     passFail: string,
     *     proves: string
     * }>
     */
    private function evidenceRows(): array
    {
        /** @var array<int, array{key: string, route_name: string, object_reference: string, expected_by_scenario: array<string, string>}> $definitions */
        $definitions = config('idor_test_template.endpoint_definitions', []);

        /** @var array<string, array{actual_result?: string, pass_fail?: string}> $recorded */
        $recorded = config('idor_test_template.recorded_results', []);

        $definitionsByKey = [];

        foreach ($definitions as $definition) {
            $definitionsByKey[$definition['key']] = $definition;
        }

        $cases = [
            ['key' => 'documents_insecure_id', 'scenario' => 'other_user', 'proves' => 'Raw IDs without authorisation are exploitable.'],
            ['key' => 'documents_secure_id', 'scenario' => 'other_user', 'proves' => 'Authorizing resolved objects blocks cross-user access.'],
            ['key' => 'documents_insecure_uuid', 'scenario' => 'other_user', 'proves' => 'UUID endpoints still fail without authorization.'],
            ['key' => 'documents_secure_uuid', 'scenario' => 'other_user', 'proves' => 'UUID & authorization together prevent IDOR.'],
            ['key' => 'invoices_insecure_web', 'scenario' => 'other_user', 'proves' => 'Business keys also fail without object authorization.'],
            ['key' => 'invoices_secure_web', 'scenario' => 'other_user', 'proves' => 'Policy enforcement secures invoice_number lookups.'],
            ['key' => 'invoices_insecure_api', 'scenario' => 'other_user', 'proves' => 'Authentication alone is insufficient.'],
            ['key' => 'invoices_secure_api', 'scenario' => 'other_user', 'proves' => 'Authorisation gives the intended 403 deny.'],
        ];

        $rows = [];

        foreach ($cases as $case) {
            $definition = $definitionsByKey[$case['key']] ?? null;

            if (! is_array($definition)) {
                continue;
            }

            $resultKey = $case['key'].'.'.$case['scenario'];
            $result = $recorded[$resultKey] ?? [];

            $rows[] = [
                'endpoint' => $definition['route_name'],
                'reference' => $this->displayReference($definition['object_reference']),
                'expected' => $definition['expected_by_scenario'][$case['scenario']] ?? '403',
                'actual' => $result['actual_result'] ?? '-',
                'passFail' => $result['pass_fail'] ?? 'Pending',
                'proves' => $case['proves'],
            ];
        }

        return $rows;
    }

    private function displayReference(string $objectReference): string
    {
        if ($objectReference === 'document') {
            return 'id / uuid';
        }

        if ($objectReference === 'invoice') {
            return 'invoice_number';
        }

        return $objectReference;
    }
}
