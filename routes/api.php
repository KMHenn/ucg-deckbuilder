<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CardController;


Route::name('api')->group(function(){
    Route::name('.cards')->prefix('cards')->group(function(){
        Route::get('/', [CardController::class, 'show'])->name('.list');

        Route::get('filters', [CardController::class, 'getFilters'])->name('.filters');
    });
});