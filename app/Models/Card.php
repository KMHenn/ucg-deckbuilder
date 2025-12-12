<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

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
        'bp_ranks' => 'json',
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

    private function getBaseIdentifier(): string{
        if(!is_null($this->bundle)){
            return sprintf('%s%s-%s', $this->section, $this->bundle,$this->serial);
        }

        return sprintf('%s-%s', $this->section, $this->serial);
    }
}
