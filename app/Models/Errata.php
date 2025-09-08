<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Errata extends Model
{
    protected $fillable = [
        'card_id',
        'url'
    ];
}
