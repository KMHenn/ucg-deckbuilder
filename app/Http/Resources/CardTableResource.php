<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\IsCardResource;

class CardTableResource extends JsonResource
{
    use IsCardResource;

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
            'rarity' => $this->rarity,
            'character_name' => $this->character_name,
            'details' => $this->getDetailsForCard(),
        ];
    }
}
