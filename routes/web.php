<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Card;
use App\Http\Controllers\DeckbuilderController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/deckbuilder', [DeckbuilderController::class, 'show'])->name('deckbuilder');

Route::get('/card-tracker', function(){
    return Inertia::render('card-tracker', ['totalCards' => Card::count()]);
})->name('card-tracker');
