<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Resources\UserResource;
use App\Models\User;

Route::get('/', fn() => Inertia::render('welcome'))->name('home');
Route::get('/deckbuilder', fn() => Inertia::render('deckbuilder'))->name('deckbuilder');
Route::get('/card-tracker', fn() => Inertia::render('card-tracker'))->name('card-tracker');


Route::name('auth')->prefix('auth')->group(function(){
    Route::post('/register', RegisterController::class)->name('.register');
    Route::post('/login', LoginController::class)->name('.login');
    
    Route::middleware('auth:web')->group(function(){
        Route::post('/logout', LogoutController::class)->name('.logout');
        Route::get('/user', fn (Illuminate\Http\Request $request) => new UserResource($request->user()))->name('.user');
    });
});

Route::name('cards')->prefix('cards')->group(function(){
    Route::get('/', [CardController::class, 'list'])->name('.list');
    Route::get('/filters', [CardController::class, 'getFilters'])->name('.filters');
    
    Route::get('/{card}', [CardController::class, 'show'])->name('.show');
    Route::post('/{card}/quantity', [CardController::class, 'updateQuantity'])->name('.quantity');
});

Route::name('decks')->prefix('decks')->group(function(){
    Route::get('/{deck}', [DeckController::class, 'show'])->name('.show');
    Route::post('/{deck}', [DeckController::class, 'update'])->name('.update');
});