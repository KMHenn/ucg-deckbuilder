<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Models\Card;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class DeckbuilderController extends Controller
{
    public function show(){
        return Inertia::render('deckbuilder', ['totalPages' => ceil(Card::count() / 12)]);
    }
    
    public function store(){
        // @TODO
    }
}
