<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests\CardRequest;
use App\Models\Card;
use App\Http\Resources\CardDisplayResource;
use App\Http\Resources\CardTableResource;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

const FORMAT_CARDS = 'cards';
const FORMAT_TABLE = 'table';

class CardController extends Controller
{
    /**
     * GET Card Listing
     * 
     * @response array{data: CardDisplayResource[]}
     */
    public function show(CardRequest $request){
        $format = $request->input('format', FORMAT_CARDS);
        $perPage = $request->input('per_page', 12);
        $pageNumber = $request->input('page', 1);
        $participatingWorks = $request->input('participating_works');
        $rarities = $request->input('rarities', null);
        
        // Exclude illegal cards
        $query = Card::whereNull('ascended_date');

        if(!is_null($rarities)){
            $query = $query->whereIn('rarity', explode(',',$rarities));
        }

        if(!is_null($participatingWorks)){
            $query->whereIn('participating_works', explode(',', $participatingWorks));
        }

        $query = $query->offset($perPage * ($pageNumber - 1))
            ->limit($perPage)
            ->get();

        if($format === FORMAT_TABLE){
            return CardTableResource::collection($query);
        }

        return CardDisplayResource::collection($query);
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
            // @TODO can this be refactored to leverage the formatting functions in Card.php?
            $values = Card::distinct($filter)
                ->pluck($filter)
                ->map(fn ($value) => [
                    'value' => (string)$value ?? '',
                    'label' => ucwords(strtolower(str_replace('_', ' ', (string)$value))) ?? 'None'
                ])
                ->values()
                ->toArray();

            return [
                $filter => [
                    'label' =>  ucwords(str_replace('_', ' ', $filter)),
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
}
