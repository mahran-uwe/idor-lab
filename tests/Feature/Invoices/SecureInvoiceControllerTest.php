<?php

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('users cannot view secure invoices they do not own', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $invoice = new Invoice;
    $invoice->user_id = $owner->id;
    $invoice->invoice_number = 'INV-1001';
    $invoice->due_date = now()->addDays(7)->toDateString();
    $invoice->status = 0;
    $invoice->subtotal = 100;
    $invoice->gst = 8;
    $invoice->total = 108;
    $invoice->save();

    $response = $this
        ->actingAs($intruder)
        ->get(route('secure.invoices.show', ['invoice' => $invoice->invoice_number]));

    $response->assertForbidden();
});
