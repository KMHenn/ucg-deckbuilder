<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Card;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/deckbuilder', function(){
    return Inertia::render('deckbuilder', ['totalPages' => ceil(Card::count() / 12)]);
})->name('deckbuilder');

Route::get('/card-tracker', function(){
    return Inertia::render('card-tracker');
})->name('card-tracker');
