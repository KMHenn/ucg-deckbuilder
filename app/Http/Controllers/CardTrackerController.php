<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Card;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class CardTrackerController extends Controller
{
    public function show(){
        return Inertia::render('card-tracker', ['totalCards' => Card::count()]);
    }
}
