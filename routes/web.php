<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Card;
use App\Http\Controllers\Web\DeckbuilderController;
use App\Http\Controllers\Web\UserController;
use App\Http\Controllers\Web\CardTrackerController;
use App\Http\Controllers\Web\AuthController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/deckbuilder', [DeckbuilderController::class, 'show'])->name('deckbuilder');

Route::get('/card-tracker', [CardTrackerController::class, 'show'])->name('card-tracker');