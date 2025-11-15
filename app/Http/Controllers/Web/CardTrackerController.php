<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;
use App\Models\Card;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class CardTrackerController extends Controller
{
    public function show(){
        return Inertia::render('card-tracker', ['totalCards' => Card::count(), 'filters' => $this->getFiltersForTable()]);
    }
    
    public function store(){
        // @TODO
    }

    private function getFiltersForTable(): array{
        $filters = [];
        $filterColumns = [
            'feature',
            'rarity', 
            'participating_works',
            'level',
            'round',
            'character_name',
            'type'
        ];

        $filters = collect($filterColumns)->mapWithKeys(fn ($col) => [
            $col => Card::distinct($col)->pluck($col),
        ])->toArray();

        $filters['section_bundle'] = Card::select('section', 'bundle')
            ->distinct()
            ->orderBy('section')
            ->get()
            ->map(fn ($row) =>
                is_null($row->bundle)
                    ? $row->section
                    : "{$row->section}-{$row->bundle}"
            )
            ->values()
            ->toArray();

        return $filters;
    }
}
