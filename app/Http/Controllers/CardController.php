<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ShowCardsRequest;
use App\Models\Card;
use App\Http\Resources\CardResource;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;


class CardController extends Controller
{
    /**
     * GET Card Listing
     * 
     * @response array{data: CardResource[], meta: array{total_cards: int, page: int, per_page: int}}
     */
    public function list(ShowCardsRequest $request){
        $perPage = $request->validated('per_page', 12);
        $pageNumber = $request->validated('page', 1);
        $query = Card::query();

        // Maybe filter illegal cards
        $includeAscended = $request->validated('include_ascended', false);
        if(!$includeAscended){
            $query = $query->whereNull('ascended_date');
        }
        else{
            $query = $query->whereNotNull('ascended_date');
        }

        foreach($request->validated() as $key => $filter){
            if(in_array($key, ['page','per_page'])){
                continue;
            }

            // Special scenario since these filter options are compounds
            if($key === 'section_bundle'){
                foreach($filter as $sectionBundle){
                    [$section, $bundle] = array_pad(explode('-', $sectionBundle), 2, null);
                    
                    $query->where(function($q) use ($section, $bundle){
                        $q->where('section', $section);
                        
                        if(!is_null($bundle)){
                            $q->where('bundle', $bundle);
                        }
                        else{
                            $q->whereNull('bundle');
                        }
                    });
                }
                
                continue;
            }
            
            $query = $query->whereIn($key, $filter);
        }

        $totalCards = (clone $query)->count();
        $query = $query->offset($perPage * ($pageNumber - 1))
            ->limit($perPage)
            ->get();

        return response()->json([
            'data' => CardResource::collection($query),
            'meta' => [
                'total_cards' => $totalCards,
            ]
        ]);
    }

    /**
     * GET Card Details
     * 
     * @response array{data: CardResource}
     */
    public function show(Card $card, Request $request){
        return new CardResource($card);
    }

    /**
     * GET Available Filters
     * 
     * @response array{data: array{label: string, column: string, options: array{}}, meta: array{filter_count: int}}
     */
    public function getFilters(){
        $filters = [];
        $standardFilterColumns = [
            'feature',
            'rarity',
            'participating_works',
            'level',
            'round',
            'character_name',
            'type',
        ];

        $filters = collect($standardFilterColumns)->mapWithKeys(function ($filter) {
            $filterLabel = ucwords(str_replace('_', ' ', $filter));

            // @TODO can this be refactored to leverage the formatting functions in Card.php?
            $values = Card::distinct($filter)
                ->whereNotNull($filter)
                ->orderBy($filter)
                ->pluck($filter);

            if(in_array($filter, ['level', 'round'])){
                $values = $values->map(fn ($value) => [
                    'value' => (string)$value ?? '',
                    'label' => $filterLabel . ' ' . ucwords(strtolower(str_replace('_', ' ', (string)$value)))
                ]);
            }
            elseif($filter === 'rarity'){
                $values = $values->map(fn ($value) => [
                    'value' => (string)$value ?? '',
                    'label' => str_replace('_', ' ', (string)$value)
                ]);
            }
            else{
                $values = $values->map(fn ($value) => [
                    'value' => (string)$value ?? '',
                    'label' => ucwords(strtolower(str_replace('_', ' ', (string)$value)))
                ]);
            }
            
            $values = $values->values()->toArray();

            return [
                $filter => [
                    'label' =>  $filterLabel,
                    'options' => $values
                ]
            ];
        });

        // Special case since it involves combining two columns
        $sectionBundle = Card::select('section', 'bundle')
            ->distinct()
            ->orderBy('section')
            ->get()
            ->map(function ($row) {
                $combined = is_null($row->bundle)
                    ? $row->section
                    : "$row->section-$row->bundle";

                return [
                    'value' => (string)$combined ?? '',
                    'label' => ucwords(str_replace('_', ' ', $combined)),
                ];
            })
            ->values()
            ->toArray();

        // Add to filter list
        $filters['section_bundle'] = [
            'label' => 'Section Bundle',
            'options' => $sectionBundle
        ];

        return new JsonResponse([
            'data' => $filters,
            'meta' => [
                'filter_count' => count($filters)
            ]
        ]);
    }

    public function updateQuantity(Card $card, Request $request){
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:0']
        ]);

        $user = auth()->user();
        if (is_null($user)) {
            return response()->json(['message' => 'You must be logged in to track cards.'], 401);
        }

        $user->cards()->syncWithoutDetaching([
            $card->id => ['quantity' => $data['quantity']]
        ]);

        return response()->json(['message' => 'Quantity updated successfully'], 200);
    }
}
