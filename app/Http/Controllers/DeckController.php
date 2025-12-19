<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDeckRequest;
use App\Http\Requests\UpdateDeckRequest;
use Illuminate\Http\Request;
use App\Models\Deck;
use App\Models\Card;
use App\Http\Resources\DeckResource;
use App\Http\Resources\CardResource;
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
        $user = auth()?->user();
        $decks = $user->decks;

        return DeckResource::collection($decks);
    }

    /**
     * POST Create Deck
     */
    public function create(CreateDeckRequest $request){
        $data = $request->validated();
        $user = auth()?->user();

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

    /**
     * POST Update Deck
     */
    public function update(Deck $deck, UpdateDeckRequest $request){
        // @TODO update deck
    }

    /**
     * GET Draw Hand
     */
    public function drawHand(Deck $deck, Request $request){
        // @TODO can this be streamlined? Queries reduced?
        $deckCards = $deck->cards()->withPivot('quantity')->get();
        $expandedDeckCards = [];

        foreach($deckCards as $deckCard){
            for($i = 0; $i < $deckCard->pivot->quantity; ++$i){
                $expandedDeckCards[] = $deckCard->id;
            }
        }

        shuffle($expandedDeckCards);
        $hand = array_slice($expandedDeckCards, 0, 6);

        // Fetch all unique card models at once
        $cardsById = Card::whereIn('id', $hand)
            ->get()
            ->keyBy('id');

        // Map back to preserve duplicates and order
        $handCards = collect($hand)->map(fn($id) => $cardsById[$id]);
        return CardResource::collection($handCards);
    }

    /**
     * Get breakdown of rounds/levels by specific characters
     */
    private function getStatistics(Deck $deck){
        $deckTotal = DB::table('deck_cards')
            ->where('deck_id', $deck->id)
            ->sum('quantity');

        // Get breakdown of card distribution
        // Scenes are structured differently than kaiju/ultras, so they need to be handled separately
        $rows = DB::table('deck_cards')
            ->join('cards', 'cards.id', '=', 'deck_cards.card_id')
            ->where('deck_cards.deck_id', $deck->id)
            ->selectRaw("
                CASE 
                    WHEN cards.feature = 'scene' THEN 'Scenes'
                    ELSE cards.character_name
                END as `character`,
                CASE
                    WHEN cards.feature = 'scene' THEN cards.round
                    ELSE cards.level
                END as bucket,
                cards.feature,
                SUM(deck_cards.quantity) as total
            ")
            ->groupBy('character', 'bucket', 'cards.feature')
            ->orderBy('character')
            ->orderBy('bucket')
            ->get();

        return $rows
            ->groupBy('character')
            ->sortBy(fn ($_, $character) => $character === 'Scenes' ? 1 : 0)
            ->map(function ($items, $character) use ($deckTotal) {
                $characterTotal = $items->sum('total');

                $row = [
                    'character' => $character,
                    'deckPercent' => round(($characterTotal / $deckTotal) * 100, 1),
                ];

                foreach ($items as $item) {
                    $label = $item->feature === 'scene'
                        ? 'Round ' . $item->bucket
                        : 'Level ' . $item->bucket;

                    $row[$label] = $item->total;

                    $row[$label . 'Percent'] = round(
                        ($item->total / $characterTotal) * 100,
                        1
                    );
                }

                return $row;
        })->values();
    }
}
