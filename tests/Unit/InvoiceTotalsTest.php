<?php

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('invoice item save computes line total and updates invoice totals', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create();

    $invoice = new Invoice;
    $invoice->user_id = $user->id;
    $invoice->invoice_number = 'INV-UNIT-1001';
    $invoice->due_date = now()->addDays(7)->toDateString();
    $invoice->status = 0;
    $invoice->subtotal = 0;
    $invoice->gst = 0;
    $invoice->total = 0;
    $invoice->save();

    $item = new InvoiceItem;
    $item->invoice_id = $invoice->id;
    $item->product_id = $product->id;
    $item->quantity = 3;
    $item->unit_price = 15.50;
    $item->save();

    $item->refresh();
    $invoice->refresh();

    expect((float) $item->line_total)->toBe(46.5)
        ->and((float) $invoice->subtotal)->toBe(46.5)
        ->and((float) $invoice->gst)->toBe(3.72)
        ->and((float) $invoice->total)->toBe(50.22);
});

test('invoice totals are recalculated when an item is deleted', function () {
    $user = User::factory()->create();
    $productA = Product::factory()->create();
    $productB = Product::factory()->create();

    $invoice = new Invoice;
    $invoice->user_id = $user->id;
    $invoice->invoice_number = 'INV-UNIT-1002';
    $invoice->due_date = now()->addDays(7)->toDateString();
    $invoice->status = 0;
    $invoice->subtotal = 0;
    $invoice->gst = 0;
    $invoice->total = 0;
    $invoice->save();

    $firstItem = new InvoiceItem;
    $firstItem->invoice_id = $invoice->id;
    $firstItem->product_id = $productA->id;
    $firstItem->quantity = 2;
    $firstItem->unit_price = 10;
    $firstItem->save();

    $secondItem = new InvoiceItem;
    $secondItem->invoice_id = $invoice->id;
    $secondItem->product_id = $productB->id;
    $secondItem->quantity = 1;
    $secondItem->unit_price = 30;
    $secondItem->save();

    $firstItem->delete();
    $invoice->refresh();

    expect((float) $invoice->subtotal)->toBe(30.0)
        ->and((float) $invoice->gst)->toBe(2.4)
        ->and((float) $invoice->total)->toBe(32.4);
});
