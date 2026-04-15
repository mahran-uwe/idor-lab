<?php

use App\Http\Controllers\Api\InsecureInvoiceController;
use App\Http\Controllers\Api\SecureInvoiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::name('api.')->middleware('auth:sanctum')->group(function () {

    Route::prefix('insecure')->name('insecure.')->group(function () {
        Route::get('invoices/{invoice:invoice_number}', InsecureInvoiceController::class)
            ->name('invoices.show');
    });

    Route::prefix('secure')->name('secure.')->group(function () {
        Route::get('invoices/{invoice:invoice_number}', SecureInvoiceController::class)
            ->name('invoices.show');
    });
    
});
