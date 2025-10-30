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
            'feature' => $this->feature,
            'formatted_name' => $this->formattedName(),
            'effect' => $this->effect,
            'thumbnail_url' => $this->thumbnail_url,
            'errata' => $this->errata_url,
            'ascended' => !is_null($this->ascended_date),
            'override_card_limit' => $this->override_card_limit,
            'related_cards' => $this->whenNull($this->branch, $this->getRelatedCards()) ?? []
        ];
    }
}
