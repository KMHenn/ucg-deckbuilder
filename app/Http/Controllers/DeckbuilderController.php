<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Card;

class DeckbuilderController extends Controller
{
    //
    public function getCardList(Request $request){
        $perPage = 12;
        $pageNumber = $request->input('page', 1);
        return Card::whereNull('ascended_date')
            ->offset($perPage * ($pageNumber - 1))
            ->limit($perPage)
            ->get()
            ->toResourceCollection();
    }
}
