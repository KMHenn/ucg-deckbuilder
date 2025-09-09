<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Card;

class DeckbuilderController extends Controller
{
    public function show(){
        $standardVariants = Card::standardVariants()->select('name', 'serial')->get();
        return view('deckbuilder', ['standardVariants' => $standardVariants]);
    }
}
