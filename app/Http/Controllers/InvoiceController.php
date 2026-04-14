<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $invoices = Invoice::query()
            ->get();

        return inertia('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }
}
