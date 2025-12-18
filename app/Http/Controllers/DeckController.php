<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateDeckRequest;
use Illuminate\Http\Request;
use App\Models\Deck;

class DeckController extends Controller
{
    /**
     * GET Deck
     */
    public function show(Deck $deck, Request $request){
        // @TODO get spec
    }

    public function update(Deck $deck, UpdateDeckRequest $request){
        // @TODO update deck
    }
}
