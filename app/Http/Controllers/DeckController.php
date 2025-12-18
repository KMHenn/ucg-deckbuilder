<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDeckRequest;
use App\Http\Requests\UpdateDeckRequest;
use Illuminate\Http\Request;
use App\Models\Deck;
use App\Http\Resources\DeckResource;

class DeckController extends Controller
{
    public function show(Deck $deck, Request $request){
        return new DeckResource($deck->load('cards'));
    }

    public function list(Request $request){
        $user = auth()->user();
        $decks = $user->decks;

        return DeckResource::collection($decks);
    }

    public function create(CreateDeckRequest $request){
        $data = $request->validated();
        $user = auth()->user();

        $deck = Deck::create([
            'user_id' => $user->id,
            'name' => $data['name']
        ]);

        // Prepare data for pivot table: [card_id => ['quantity' => x], ...]
        $cards = [];
        foreach ($data['deck'] as $cardId => $card) {
            $cards[$cardId] = ['quantity' => $card['quantity']];
        }

        $deck->cards()->sync($cards);

        return new DeckResource($deck->load('cards'));
    }

    public function update(Deck $deck, UpdateDeckRequest $request){
        // @TODO update deck
    }
}
