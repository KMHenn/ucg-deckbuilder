<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Card;
use App\Http\Controllers\DeckbuilderController;
use App\Http\Controllers\CardController;


Route::name('api')->group(function(){
    Route::get('/cards', [CardController::class, 'show'])
        ->name('cards');
});