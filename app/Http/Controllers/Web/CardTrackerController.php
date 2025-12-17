<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Models\Card;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class CardTrackerController extends Controller
{
    public function show(){
        return Inertia::render('card-tracker', ['totalCards' => Card::count()]);
    }
    
    public function store(Card $card, Request $request){
        $user = auth()->user();
        if(is_null($user)){
            // Fail, need user to track quantity
        }
    }
}
