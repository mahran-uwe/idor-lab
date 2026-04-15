<?php

use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('insecure invoice api allows users to access invoices they do not own', function () {
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
        ->getJson(route('api.insecure.invoices.show', ['invoice' => $invoice->invoice_number]));

    $response->assertSuccessful();
    $response->assertJsonPath('invoice.user_id', $owner->id);
    $response->assertJsonPath('invoice.invoice_number', 'INV-1001');
});

test('secure invoice api forbids users from accessing invoices they do not own', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $invoice = new Invoice;
    $invoice->user_id = $owner->id;
    $invoice->invoice_number = 'INV-1002';
    $invoice->due_date = now()->addDays(7)->toDateString();
    $invoice->status = 0;
    $invoice->subtotal = 100;
    $invoice->gst = 8;
    $invoice->total = 108;
    $invoice->save();

    $response = $this
        ->actingAs($intruder)
        ->getJson(route('api.secure.invoices.show', ['invoice' => $invoice->invoice_number]));

    $response->assertForbidden();
});

test('secure invoice api allows owners to access their invoices', function () {
    $owner = User::factory()->create();

    $invoice = new Invoice;
    $invoice->user_id = $owner->id;
    $invoice->invoice_number = 'INV-1003';
    $invoice->due_date = now()->addDays(7)->toDateString();
    $invoice->status = 0;
    $invoice->subtotal = 100;
    $invoice->gst = 8;
    $invoice->total = 108;
    $invoice->save();

    $response = $this
        ->actingAs($owner)
        ->getJson(route('api.secure.invoices.show', ['invoice' => $invoice->invoice_number]));

    $response->assertSuccessful();
    $response->assertJsonPath('invoice.user_id', $owner->id);
    $response->assertJsonPath('invoice.invoice_number', 'INV-1003');
});
