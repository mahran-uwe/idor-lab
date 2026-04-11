<?php

use App\Models\User;
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
    try {
        $user = User::where('name', $user)->firstOrFail();
        Auth::loginUsingId($user->id);
        request()->session()->regenerate();

        return redirect()->route('dashboard');
    } catch (Exception $e) {
        return redirect()->route('home')->with('error', 'User not found.');
    }
})->name('loginAs')->middleware('guest');
