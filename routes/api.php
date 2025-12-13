<?php

use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\Auth\RegisterController;



Route::name('api')->group(function(){
    Route::name('.v1')->prefix('v1')->middleware('web')->group(function(){
        Route::post('/register', RegisterController::class)->name('.register');
        Route::post('/login', LoginController::class)->name('.login');
        Route::post('/logout', LogoutController::class)->name('.logout');
        Route::middleware('auth:sanctum')->group(function(){
            Route::get('/me', fn () => auth()->user());
        });

        Route::name('.cards')->prefix('cards')->group(function(){
            Route::get('/', [CardController::class, 'index'])->name('.index');
            Route::get('/filters', [CardController::class, 'getFilters'])->name('.filters');
            
            Route::get('/{card}', [CardController::class, 'show'])->name('.show');
            Route::post('/{card}/quantity', [CardController::class, 'updateQuantity'])->middleware('auth:sanctum')->name('.quantity');
        });
        
    });
});