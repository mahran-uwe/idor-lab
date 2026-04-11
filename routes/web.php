<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome', [
    'canRegister' => false,
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

Route::get('/login-as/{user}', function ($user) {
    $user = \App\Models\User::where('name', $user)->firstOrFail();
    Auth::loginUsingId($user->id);
    request()->session()->regenerate();
})->name('loginAs')->middleware('guest');
