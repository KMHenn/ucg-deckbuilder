<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Card;
use App\Http\Resources\CardDisplayResource;
use App\Http\Resources\CardTableResource;

const FORMAT_CARDS = 'cards';
const FORMAT_TABLE = 'table';

class CardController extends Controller
{
    public function show(Request $request){
        $format = $request->input('format', FORMAT_CARDS);
        $perPage = $request->input('per_page', 12);
        $pageNumber = $request->input('page', 1);
        $query = Card::whereNull('ascended_date')
            ->offset($perPage * ($pageNumber - 1))
            ->limit($perPage)
            ->get();

        if($format === FORMAT_TABLE){
            return CardTableResource::collection($query);
        }

        return CardDisplayResource::collection($query);
    }
}
