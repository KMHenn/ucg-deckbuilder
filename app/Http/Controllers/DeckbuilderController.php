<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Card;
use Inertia\Inertia;

class DeckbuilderController extends Controller
{
    public function show(){
        $standardVariants = Card::standardVariants()->select('name', 'serial')->get();

        return Inertia::render('Deckbuilder/Show', [
            'standardVariants'
        ]);
    }
}
