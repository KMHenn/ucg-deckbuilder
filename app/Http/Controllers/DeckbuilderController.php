<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Card;
use Inertia\Inertia;

class DeckbuilderController extends Controller
{
    public function show(){
        $standardVariants = Card::standardVariants()->select('id','name', 'serial', 'thumbnail_url as thumbnail', 'number')->get();

        return Inertia::render('Deckbuilder/Show', [
            'standardVariants' => $standardVariants
        ]);
    }
}
