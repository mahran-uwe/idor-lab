<?php

return [
    'user_scenarios' => [
        [
            'key' => 'owner_user',
            'user_role' => 'Owner',
            'object_case' => 'own',
        ],
        [
            'key' => 'other_user',
            'user_role' => 'User B',
            'object_case' => 'User A',
        ],
        [
            'key' => 'admin_user',
            'user_role' => 'Admin',
            'object_case' => 'User A',
        ],
    ],

    'endpoint_definitions' => [
        [
            'key' => 'documents_insecure_id',
            'route_name' => 'insecure.documents.show',
            'resource' => 'Docs',
            'object_reference' => 'document',
            'enforcement' => 'no gate',
            'notes' => 'idor demo',
            'expected_by_scenario' => [
                'owner_user' => '200',
                'other_user' => '403',
                'admin_user' => '200',
            ],
            'severity_by_scenario' => [
                'owner_user' => 'Low',
                'other_user' => 'High',
                'admin_user' => 'Low',
            ],
        ],
        [
            'key' => 'documents_secure_id',
            'route_name' => 'secure.documents.show',
            'resource' => 'Docs',
            'object_reference' => 'document',
            'enforcement' => 'DocumentPolicy@view',
            'notes' => 'secure endpoint',
            'expected_by_scenario' => [
                'owner_user' => '200',
                'other_user' => '403',
                'admin_user' => '200',
            ],
            'severity_by_scenario' => [
                'owner_user' => 'Low',
                'other_user' => 'High',
                'admin_user' => 'Low',
            ],
        ],
        [
            'key' => 'documents_insecure_uuid',
            'route_name' => 'insecure.uuid.show',
            'resource' => 'UUID',
            'object_reference' => 'document',
            'enforcement' => 'uuid only',
            'notes' => 'idor demo',
            'expected_by_scenario' => [
                'owner_user' => '200',
                'other_user' => '403',
                'admin_user' => '200',
            ],
            'severity_by_scenario' => [
                'owner_user' => 'Low',
                'other_user' => 'High',
                'admin_user' => 'Low',
            ],
        ],
        [
            'key' => 'documents_secure_uuid',
            'route_name' => 'secure.uuid.show',
            'resource' => 'UUID',
            'object_reference' => 'document',
            'enforcement' => 'DocumentPolicy@view',
            'notes' => 'secure endpoint',
            'expected_by_scenario' => [
                'owner_user' => '200',
                'other_user' => '403',
                'admin_user' => '200',
            ],
            'severity_by_scenario' => [
                'owner_user' => 'Low',
                'other_user' => 'High',
                'admin_user' => 'Low',
            ],
        ],
        [
            'key' => 'invoices_insecure_web',
            'route_name' => 'insecure.invoices.show',
            'resource' => 'Invoices',
            'object_reference' => 'invoice',
            'enforcement' => 'no gate',
            'notes' => 'idor demo',
            'expected_by_scenario' => [
                'owner_user' => '200',
                'other_user' => '403',
                'admin_user' => '200',
            ],
            'severity_by_scenario' => [
                'owner_user' => 'Low',
                'other_user' => 'High',
                'admin_user' => 'Low',
            ],
        ],
        [
            'key' => 'invoices_secure_web',
            'route_name' => 'secure.invoices.show',
            'resource' => 'Invoices',
            'object_reference' => 'invoice',
            'enforcement' => 'InvoicePolicy@view',
            'notes' => 'secure endpoint',
            'expected_by_scenario' => [
                'owner_user' => '200',
                'other_user' => '403',
                'admin_user' => '200',
            ],
            'severity_by_scenario' => [
                'owner_user' => 'Low',
                'other_user' => 'High',
                'admin_user' => 'Low',
            ],
        ],
        [
            'key' => 'invoices_insecure_api',
            'route_name' => 'api.insecure.invoices.show',
            'resource' => 'API',
            'object_reference' => 'invoice',
            'enforcement' => 'sanctum only',
            'notes' => 'idor demo',
            'expected_by_scenario' => [
                'owner_user' => '200',
                'other_user' => '403',
                'admin_user' => '200',
            ],
            'severity_by_scenario' => [
                'owner_user' => 'Low',
                'other_user' => 'High',
                'admin_user' => 'Low',
            ],
        ],
        [
            'key' => 'invoices_secure_api',
            'route_name' => 'api.secure.invoices.show',
            'resource' => 'API',
            'object_reference' => 'invoice',
            'enforcement' => 'sanctum + policy',
            'notes' => 'secure endpoint',
            'expected_by_scenario' => [
                'owner_user' => '200',
                'other_user' => '403',
                'admin_user' => '200',
            ],
            'severity_by_scenario' => [
                'owner_user' => 'Low',
                'other_user' => 'High',
                'admin_user' => 'Low',
            ],
        ],
    ],

    // Optional: {endpoint_key}.{scenario_key}
    'recorded_results' => [
        'documents_insecure_id.owner_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],
        'documents_insecure_id.other_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Fail',
        ],
        'documents_insecure_id.admin_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],

        'documents_secure_id.owner_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],
        'documents_secure_id.other_user' => [
            'actual_result' => '403',
            'pass_fail' => 'Pass',
        ],
        'documents_secure_id.admin_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],

        'documents_insecure_uuid.owner_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],
        'documents_insecure_uuid.other_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Fail',
        ],
        'documents_insecure_uuid.admin_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],

        'documents_secure_uuid.owner_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],
        'documents_secure_uuid.other_user' => [
            'actual_result' => '403',
            'pass_fail' => 'Pass',
        ],
        'documents_secure_uuid.admin_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],

        'invoices_insecure_web.owner_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],
        'invoices_insecure_web.other_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Fail',
        ],
        'invoices_insecure_web.admin_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],

        'invoices_secure_web.owner_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],
        'invoices_secure_web.other_user' => [
            'actual_result' => '403',
            'pass_fail' => 'Pass',
        ],
        'invoices_secure_web.admin_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],

        'invoices_insecure_api.owner_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],
        'invoices_insecure_api.other_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Fail',
        ],
        'invoices_insecure_api.admin_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],

        'invoices_secure_api.owner_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],
        'invoices_secure_api.other_user' => [
            'actual_result' => '403',
            'pass_fail' => 'Pass',
        ],
        'invoices_secure_api.admin_user' => [
            'actual_result' => '200',
            'pass_fail' => 'Pass',
        ],
    ],
];
