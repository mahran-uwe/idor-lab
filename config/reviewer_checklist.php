<?php

return [
    'rows' => [
        [
            'id' => 'C1',
            'route_name' => 'secure.documents.show',
            'resource' => 'Documents',
            'action' => 'Read',
            'object_reference' => 'ID',
            'rule_enforcement_point' => 'DocumentPolicy@view',
            'reviewed' => true,
        ],
        [
            'id' => 'C2',
            'route_name' => 'secure.uuid.show',
            'resource' => 'Documents',
            'action' => 'Read',
            'object_reference' => 'UUID',
            'rule_enforcement_point' => 'DocumentPolicy@view',
            'reviewed' => true,
        ],
        [
            'id' => 'C3',
            'route_name' => 'secure.invoices.show',
            'resource' => 'Invoices',
            'action' => 'Read',
            'object_reference' => 'invoice_number',
            'rule_enforcement_point' => 'InvoicePolicy@view',
            'reviewed' => true,
        ],
        [
            'id' => 'C4',
            'route_name' => 'api.secure.invoices.show',
            'resource' => 'Invoices',
            'action' => 'Read',
            'object_reference' => 'invoice_number',
            'rule_enforcement_point' => 'InvoicePolicy@view',
            'reviewed' => true,
        ],
    ],
];
