<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Card;
use Inertia\Inertia;

class DeckbuilderController extends Controller
{
    public function show(){
        return Inertia::render('deckbuilder', ['totalPages' => ceil(Card::count() / 12)]);
    }
    
    public function store(){
        // @TODO
    }
}
