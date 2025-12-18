<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Deck extends Model
{
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'user_id',
        'updated_at'
    ];

    public function user(): BelongsTo{
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function cards(): BelongsToMany{
        return $this->belongsToMany(Card::class, 'deck_cards')
            ->withPivot('quantity');
    }

    public function getStatistics(){
        // Breakdown of Kaiju vs Ultra vs Scene
        // within each breakdown of level/round
        // breakdown of character
    }
}
