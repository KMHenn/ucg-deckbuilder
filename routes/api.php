<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CardController;


Route::name('api')->group(function(){
    Route::name('.v1')->prefix('v1')->group(function(){
        Route::name('.cards')->prefix('cards')->group(function(){
            Route::get('/', [CardController::class, 'index'])->name('.index');
            Route::get('/filters', [CardController::class, 'getFilters'])->name('.filters');
            Route::get('/{card}', [CardController::class, 'show'])->name('.show');
        });
    });
});