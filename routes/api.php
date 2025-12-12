<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\AuthController;

Route::name('api')->group(function(){
    Route::name('.v1')->prefix('v1')->group(function(){
        Route::name('.auth')->prefix('auth')->group(function(){
            Route::post('/login', [AuthController::class, 'login'])->name('login');
            Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
            Route::post('/register', [AuthController::class, 'register'])->name('register');
        });

        Route::name('.cards')->prefix('cards')->group(function(){
            Route::get('/', [CardController::class, 'index'])->name('.index');
            Route::get('/filters', [CardController::class, 'getFilters'])->name('.filters');
            
            Route::get('/{card}', [CardController::class, 'show'])->name('.show');
            Route::post('/{card}/quantity', [CardController::class, 'updateQuantity'])->name('.quantity');
        });
        
    });
});