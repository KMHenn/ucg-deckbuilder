<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property Card $resource
 */
class CardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = auth()->user();
        return [
            'id' => $this->id,
            'formatted_name' => $this->formattedName(),
            'name' => $this->name,
            'subtitle' => $this->subtitle,
            'number' => $this->number,
            'thumbnail_url' => $this->thumbnail_url,
            'tags' => $this->getDetailsArray(),
            'override_card_limit' => $this->override_card_limit,
            'quantity' => !is_null($user) ? $user?->cardQuantity($this->id) : null,
            $this->mergeWhen(
                $request->routeIs('cards.show'),
                [
                    'round' => $this->round,
                    'level' => $this->level,
                    'effect' => $this->effect,
                    'feature' => $this->feature,
                    'rarity' => $this->rarity,
                    'participating_works' => $this->participating_works,
                    'section' => $this->section,
                    'bundle' => $this->bundle,
                    'character_name' => $this->character_name,
                    'errata' => $this->errata_url,
                    'ascended' => !is_null($this->ascended_date),
                    'related_cards' => $this->whenNull($this->branch, $this->getRelatedCards()) ?? [],
                ]
            )
        ];
    }
}
