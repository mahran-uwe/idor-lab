<?php

use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InsecureDocumentController;
use App\Http\Controllers\InsecureInvoiceApiController;
use App\Http\Controllers\InsecureInvoiceController;
use App\Http\Controllers\InvoiceApiDemoController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\SecureDocumentController;
use App\Http\Controllers\SecureInvoiceApiController;
use App\Http\Controllers\SecureInvoiceController;
use App\Http\Controllers\UUIDController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome', [
    'canRegister' => false,
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('documents', DocumentController::class)->name('documents.index');
    Route::get('uuid', UUIDController::class)->name('uuid.index');
    Route::get('invoices', InvoiceController::class)->name('invoices.index');
    Route::get('invoices/api', InvoiceApiDemoController::class)->name('invoices.api.index');

    Route::prefix('api')->name('api.')->group(function () {
        Route::prefix('insecure')->name('insecure.')->group(function () {
            Route::get('invoices/{invoice:invoice_number}', InsecureInvoiceApiController::class)
                ->name('invoices.show');
        });

        Route::prefix('secure')->name('secure.')->group(function () {
            Route::get('invoices/{invoice:invoice_number}', SecureInvoiceApiController::class)
                ->name('invoices.show');
        });
    });

    Route::prefix('insecure')->name('insecure.')->group(function () {
        Route::resource('documents', InsecureDocumentController::class)->only('show');

        Route::resource('documents/uuid', InsecureDocumentController::class)
            ->scoped(['document' => 'uuid'])
            ->only('show');

        Route::resource('invoices', InsecureInvoiceController::class)
            ->scoped(['invoice' => 'invoice_number'])
            ->only('show');
    });

    Route::prefix('secure')->name('secure.')->group(function () {
        Route::resource('documents', SecureDocumentController::class)->only('show');

        Route::resource('documents/uuid', SecureDocumentController::class)
            ->scoped(['document' => 'uuid'])
            ->only('show');

        Route::resource('invoices', SecureInvoiceController::class)
            ->scoped(['invoice' => 'invoice_number'])
            ->only('show');
    });
});

require __DIR__.'/settings.php';

Route::get('/login-as/{user}', function ($user) {
    try {
        $user = User::where('name', $user)->firstOrFail();
        Auth::loginUsingId($user->id);
        request()->session()->regenerate();

        return redirect()->route('dashboard');
    } catch (Exception $e) {
        return redirect()->route('home')->with('error', 'User not found.');
    }
})->name('loginAs')->middleware('guest');
