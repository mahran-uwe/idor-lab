<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Route;
use Inertia\Inertia;
use Inertia\Response;

class ReviewerChecklistController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        return Inertia::render('ReviewerChecklist/Index', [
            'rows' => $this->buildRows(),
        ]);
    }

    /**
     * @return array<int, array{
     *     id: string,
     *     endpointUseCase: string,
     *     resource: string,
     *     action: string,
     *     objectReference: string,
     *     ruleEnforcementPoint: string,
     *     reviewed: bool,
     *     evidence_notes: string,
     * }>
     */
    private function buildRows(): array
    {
        /** @var array<int, array{
         *     id: string,
         *     route_name: string,
         *     resource: string,
         *     action: string,
         *     object_reference: string,
         *     rule_enforcement_point: string,
         *     reviewed: bool,
         *     evidence_notes: string,
         * }> $definitions
         */
        $definitions = config('reviewer_checklist.rows', []);
        $routes = app('router')->getRoutes();
        $rows = [];

        foreach ($definitions as $definition) {
            $route = $routes->getByName($definition['route_name']);

            if (! $route instanceof Route) {
                continue;
            }

            $rows[] = [
                'id' => $definition['id'],
                'endpointUseCase' => $this->formatEndpointUseCase($route),
                'resource' => $definition['resource'],
                'action' => $definition['action'],
                'objectReference' => $definition['object_reference'],
                'ruleEnforcementPoint' => $definition['rule_enforcement_point'],
                'reviewed' => $definition['reviewed'],
                'evidenceNotes' => $definition['evidence_notes'],
            ];
        }

        return $rows;
    }

    private function formatEndpointUseCase(Route $route): string
    {
        $methods = array_values(array_filter($route->methods(), fn (string $method) => $method !== 'HEAD'));
        $primaryMethod = $methods[0] ?? 'GET';
        $path = '/'.ltrim($route->uri(), '/');

        return sprintf('%s %s', $primaryMethod, $path);
    }
}
