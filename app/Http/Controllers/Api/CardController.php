<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Card;
use App\Http\Resources\CardDisplayResource;
use App\Http\Resources\CardTableResource;
use App\Http\Controllers\Controller;

const FORMAT_CARDS = 'cards';
const FORMAT_TABLE = 'table';

class CardController extends Controller
{
    public function show(Request $request){
        $format = $request->input('format', FORMAT_CARDS);
        $perPage = $request->input('per_page', 12);
        $pageNumber = $request->input('page', 1);
        $rarities = $request->input('rarities', null);
        $query = Card::whereNull('ascended_date');

        if(!is_null($rarities)){
            $query = $query->whereIn('rarity', explode(',',$rarities));
        }

        $query = $query->offset($perPage * ($pageNumber - 1))
            ->limit($perPage)
            ->get();

        if($format === FORMAT_TABLE){
            return CardTableResource::collection($query);
        }

        return CardDisplayResource::collection($query);
    }
}
