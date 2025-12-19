<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDeckRequest;
use App\Http\Requests\UpdateDeckRequest;
use Illuminate\Http\Request;
use App\Models\Deck;
use App\Http\Resources\DeckResource;
use Illuminate\Support\Facades\DB;

class DeckController extends Controller
{
    /**
     * GET Deck
     * 
     * Returns full deck and details.
     */
    public function show(Deck $deck, Request $request){
        return new DeckResource($deck->load('cards'));
    }

    /**
     * GET Load Deck
     * 
     * Returns the deck, formatted for the frontend
     */
    public function load(Deck $deck, Request $request){
        $deck->load('cards');

        // Transform into the format frontend expects
        $deckData = [];
        foreach ($deck->cards as $card) {
            $deckData[$card->id] = [
                'card' => $card,
                'quantity' => $card->pivot->quantity
            ];
        }

        return response()->json([
            'data' => [
                'id' => $deck->id,
                'name' => $deck->name,
                'cards' => $deckData,
                'statistics' => $this->getStatistics($deck)
            ]
        ]);
    }

    /**
     * GET User's Decks
     */
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

    private function getStatistics(Deck $deck){

        $rows = DB::table('deck_cards')
            ->join('cards', 'cards.id', '=', 'deck_cards.card_id')
            ->where('deck_cards.deck_id', $deck->id)
            ->select(
                'cards.character_name',
                'cards.level',
                DB::raw('SUM(deck_cards.quantity) as total')
            )
            ->groupBy('cards.character_name', 'cards.level')
            ->orderBy('cards.character_name')
            ->orderBy('cards.level')
            ->get();

        return $rows
            ->groupBy('character_name')
            ->map(function ($items, $character) {
                $row = ['character' => $character];

                foreach ($items as $item) {
                    $row['level_' . $item->level] = $item->total;
                }

                return $row;
            })
            ->values();
    }
}
