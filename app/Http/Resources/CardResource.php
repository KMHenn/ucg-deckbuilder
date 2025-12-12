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
        return [
            'id' => $this->id,
            'formatted_name' => $this->formattedName(),
            'number' => $this->number,
            'thumbnail_url' => $this->thumbnail_url,
            'tags' => $this->getDetailsForCard(),
            'override_card_limit' => $this->override_card_limit,
            
            $this->mergeWhen(
                $request->routeIs('api.v1.cards.show'),
                [
                    'name' => $this->name,
                    'subtitle' => $this->subtitle,
                    'round' => $this->whenNotNull($this->round),
                    'level' => $this->whenNotNull($this->level),
                    'effect' => $this->effect,
                    'feature' => $this->feature,
                    'rarity' => $this->rarity,
                    'participating_works' => $this->participating_works,
                    'section' => $this->section,
                    'bundle' => $this->bundle,
                    'rarity' => $this->rarity,
                    'character_name' => $this->character_name,
                    'errata' => $this->errata_url,
                    'ascended' => !is_null($this->ascended_date),
                    'related_cards' => $this->whenNull($this->branch, $this->getRelatedCards()) ?? [],
                ]
            )
        ];
    }

    /**
     * Gather array formatted columns based on card type
     */
    private function getDetailsForCard(): array{
        $details = [
            'Feature' => $this->formattedFeature(),
            'Rarity' => $this->rarity,
            'Participating Works' => $this->participating_works,
            'Release' => $this->section === 'PR' ? $this->section : sprintf('%s-%s', $this->section, $this->bundle),
        ];
        if($this->feature === 'scene'){
            return array_merge(
                $details, 
                ['Round' => 'Round ' . $this->round],
            );
        }

        return array_merge(
            $details, 
            [
                'Type' => ucfirst($this->type),
                'Level' => 'Level ' . $this->level,
                'Character' => $this->character_name,
            ]
        );
    }
}
