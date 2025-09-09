<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeckbuilderController;

Route::get('/', [DeckbuilderController::class, 'show']);
