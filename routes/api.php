<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Card;
use App\Http\Controllers\DeckbuilderController;


Route::name('api')->group(function(){
    Route::get('/card-list', [DeckbuilderController::class, 'getCardList'])
        ->name('card-list');
});