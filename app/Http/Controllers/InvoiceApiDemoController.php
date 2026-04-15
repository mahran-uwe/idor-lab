<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceApiDemoController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $invoices = Invoice::query()
            ->select(['id', 'user_id', 'invoice_number', 'due_date', 'status', 'total'])
            ->orderBy('id')
            ->get();

        return inertia('Invoices/API', [
            'invoices' => $invoices,
        ]);
    }
}
