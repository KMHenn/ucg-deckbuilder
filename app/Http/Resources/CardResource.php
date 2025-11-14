<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'subtitle' => $this->subtitle,
            'number' => $this->number,
            'feature' => $this->formattedFeature(),
            'type' => ucfirst($this->type),
            'round' => $this->whenNotNull($this->round),
            'level' => $this->whenNotNull($this->level),
            'formatted_name' => $this->formattedName(),
            'effect' => $this->effect,
            'thumbnail_url' => $this->thumbnail_url,
            'rarity' => $this->rarity,
            'character_name' => $this->character_name,
            'errata' => $this->errata_url,
            'ascended' => !is_null($this->ascended_date),
            'override_card_limit' => $this->override_card_limit,
            'related_cards' => $this->whenNull($this->branch, $this->getRelatedCards()) ?? [],
            'details' => $this->getDetailsForCard(),
        ];
    }

    private function getDetailsForCard(): array{
        $details = [$this->formattedFeature()];
        if($this->feature === 'scene'){
            return array_merge(
                $details, 
                ['Round ' . $this->round]
            );
        }

        return array_merge(
            $details, 
            [
                ucfirst($this->type),
                'Level ' . $this->level,
            ]
        );
    }
}
