<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Card extends Model
{
    public $autoincrement = false;
    public $incrementing = false;
    protected $fillable = [
        'id',
        'name',
        'rarity',
        'level',
        'type',
        'feature',
        'round',
        'bp_ranks',
        'effect',
        'character_name',
        'subtitle',
        'participating_works',
        'image_url',
        'thumbnail_url',
        'section',
        'bundle',
        'serial',
        'branch',
        'number',
        'errata_url',
        'ascended_date',
        'override_card_limit'
    ];

    protected $casts = [
        'bp_ranks' => 'array',
        'ascended_date' => 'date',
        'override_card_limit' => 'boolean'
    ];

    public function scopeCharacterName(Builder $query, string $characterName): Builder{
        return $query->where('character_name', strtoupper($characterName));
    }

    public function scopeType(Builder $query, string $type): Builder{
        return $query->where('type', strtolower($type));
    }

    public function scopeKaiju(Builder $query): Builder{
        return $query->where('feature', 'kaiju');
    }

    public function scopeUltraHeroes(Builder $query): Builder{
        return $query->where('feature', 'ultra_hero');
    }

    public function scopeScenes(Builder $query): Builder{
        return $query->where('feature', 'scene');
    }

    public function scopeStandardVariants(Builder $query): Builder{
        return $query->whereNull('branch');
    }

    public function getRelatedCards(){
        return self::where('id', '!=', $this->id)
            ->where('section', $this->section)
            ->where('bundle', $this->bundle)
            ->where('serial', $this->serial)
            ->whereNotNull('branch')
            ->get();
    }

    public function isAlternate(): bool{
        return !is_null($this->branch);
    }

    public function formattedName(): string{
        if(is_null($this->subtitle)){
            return $this->name;
        }

        return sprintf('%s - %s', $this->name, $this->subtitle);
    }

    public function formattedFeature(): string{
        return match($this->feature){
            'ultra_hero' => 'Ultra Hero',
            'kaiju' => 'Kaiju',
            'scene' => 'Scene',
            default => $this->feature
        };
    }

    public function formattedSectionBundle(): string{
        if($this->section === 'PR'){
            return $this->section;
        }

        return sprintf('%s-%s', $this->section, $this->bundle);
    }

    /**
     * Note: The actual source data doesn't have any handling for RRRR cards.
     * Because of this we're assuming anything in the fourth slot is an Extra BP
     */
    public function formattedBpRanks(): array{
        if ($this->feature === 'scene') {
            return [];
        }

        $labels = collect(['Single', 'Double', 'Triple', 'Extra']);

        return $labels
            ->take(count($this->bp_ranks))
            ->combine($this->bp_ranks)
            ->all();
    }


    /**
     * Gather array formatted columns based on card type
     */
    public function getDetailsArray(): array{
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

    public function users(): BelongsToMany{
        return $this->belongsToMany(User::class, 'user_cards')
            ->withPivot('quantity');
    }
}
