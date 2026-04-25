<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuthorizationModelController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('AuthorizationModel/Index', [
            'rows' => [
                [
                    'resource' => 'Document',
                    'action' => 'View',
                    'subjectRole' => 'User',
                    'rule' => 'Own document only',
                    'default' => 'Deny',
                ],
                [
                    'resource' => 'Document',
                    'action' => 'View',
                    'subjectRole' => 'Admin',
                    'rule' => 'Any document',
                    'default' => 'Allow',
                ],
                [
                    'resource' => 'Invoice',
                    'action' => 'View',
                    'subjectRole' => 'User',
                    'rule' => 'Own invoice only',
                    'default' => 'Deny',
                ],
                [
                    'resource' => 'Invoice',
                    'action' => 'View',
                    'subjectRole' => 'Admin',
                    'rule' => 'Any invoice',
                    'default' => 'Allow',
                ],
                [
                    'resource' => 'Invoice API Endpoint',
                    'action' => 'Read',
                    'subjectRole' => 'Sanctum Authenticated User',
                    'rule' => 'Own invoice only',
                    'default' => 'Deny',
                ],
                [
                    'resource' => 'Invoice API Endpoint',
                    'action' => 'Read',
                    'subjectRole' => 'Sanctum Authenticated Admin',
                    'rule' => 'Any invoice',
                    'default' => 'Allow',
                ],
            ],
        ]);
    }
}
