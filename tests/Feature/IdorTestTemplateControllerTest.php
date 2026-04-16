<?php

use App\Models\Document;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('authenticated users can view idor test template page', function () {
    $viewer = User::factory()->create();

    $ownerUser = User::factory()->create([
        'name' => 'User A',
        'email' => 'user.a@example.com',
    ]);

    User::factory()->create([
        'name' => 'User B',
        'email' => 'user.b@example.com',
    ]);

    User::factory()->create([
        'name' => 'Super Admin',
        'email' => 'super.admin@example.com',
    ]);

    $ownerDocument = new Document;
    $ownerDocument->user_id = $ownerUser->id;
    $ownerDocument->title = 'Owner Document';
    $ownerDocument->path = base_path('composer.json');
    $ownerDocument->save();

    $ownerDocument->uuid = '11111111-1111-4111-8111-111111111111';
    $ownerDocument->save();

    $ownerInvoice = new Invoice;
    $ownerInvoice->user_id = $ownerUser->id;
    $ownerInvoice->invoice_number = 'INV-9999';
    $ownerInvoice->due_date = now()->addDays(7)->toDateString();
    $ownerInvoice->status = 0;
    $ownerInvoice->subtotal = 100;
    $ownerInvoice->gst = 10;
    $ownerInvoice->total = 110;
    $ownerInvoice->save();

    $response = $this
        ->actingAs($viewer)
        ->get(route('idor-test-template.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('IdorTestTemplate/Index')
        ->has('rows', 24)
        ->where('rows.0.testId', 'T01')
        ->where('rows.0.endpoint', sprintf('GET /insecure/documents/%d', $ownerDocument->id))
        ->where('rows.6.endpoint', sprintf('GET /insecure/documents/uuid/%s', $ownerDocument->uuid))
        ->where('rows.12.endpoint', sprintf('GET /insecure/invoices/%s', $ownerInvoice->invoice_number))
        ->where('rows.0.userRole', 'Owner')
        ->where('rows.0.actualResult', '200')
        ->where('rows.0.passFail', 'Pass')
        ->where('rows.23.testId', 'T24')
    );
});

test('guests are redirected away from idor test template page', function () {
    $response = $this->get(route('idor-test-template.index'));

    $response->assertRedirect(route('login'));
});
