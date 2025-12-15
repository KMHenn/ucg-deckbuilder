<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Web\DeckbuilderController;
use App\Http\Controllers\Web\CardTrackerController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\Auth\RegisterController;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\UserResource;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::get('/deckbuilder', [DeckbuilderController::class, 'show'])->name('deckbuilder');
Route::get('/card-tracker', [CardTrackerController::class, 'show'])->name('card-tracker');


Route::name('auth')->prefix('auth')->group(function(){
    Route::post('/register', RegisterController::class)->name('.register');
    Route::post('/login', LoginController::class)->name('.login');

    Route::middleware('auth:sanctum')->group(function(){
        Route::post('/logout', LogoutController::class)->name('.logout');
        Route::get('/user', fn (Illuminate\Http\Request $request) => new UserResource($request->user()))->name('.user');
    });
});

Route::name('cards')->prefix('cards')->group(function(){
    Route::get('/', [CardController::class, 'index'])->name('.index');
    Route::get('/filters', [CardController::class, 'getFilters'])->name('.filters');
    
    Route::get('/{card}', [CardController::class, 'show'])->name('.show');
    Route::post('/{card}/quantity', [CardController::class, 'updateQuantity'])->middleware('auth:sanctum')->name('.quantity');
});