<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SecureInvoiceApiController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Invoice $invoice): JsonResponse
    {
        Gate::authorize('view', $invoice);

        $invoice->load([
            'items' => fn ($query) => $query
                ->select(['id', 'invoice_id', 'product_id', 'quantity', 'unit_price', 'line_total'])
                ->with([
                    'product:id,name',
                ]),
        ]);

        return response()->json([
            'invoice' => [
                'id' => $invoice->id,
                'user_id' => $invoice->user_id,
                'invoice_number' => $invoice->invoice_number,
                'due_date' => $invoice->due_date,
                'status' => $invoice->status,
                'subtotal' => $invoice->subtotal,
                'gst' => $invoice->gst,
                'total' => $invoice->total,
                'items' => $invoice->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product' => $item->product?->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'line_total' => $item->line_total,
                ]),
            ],
        ]);
    }
}
