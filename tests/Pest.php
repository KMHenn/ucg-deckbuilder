<?php

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Card;
use App\Models\User;
use App\Models\Deck;

/*
|--------------------------------------------------------------------------
| Pest Test Case
|--------------------------------------------------------------------------
|
| This file is automatically loaded before your tests run.
| You can bind things like the base TestCase, helpers,
| or global expectations here.
|
*/

uses(TestCase::class, RefreshDatabase::class)->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Global Helpers
|--------------------------------------------------------------------------
|
| Define functions you want available in all tests.
|
*/

function signIn(?User $user = null)
{
    $user = $user ?? \App\Models\User::factory()->create();
    test()->actingAs($user);

    return $user;
}

function populateDeckFromJson(?User $user = null){
    $deckCards = json_decode(file_get_contents(base_path('tests/Datasets/valid-deck/deck.json')), true);
    $cards = json_decode(file_get_contents(base_path('tests/Datasets/valid-deck/cards.json')), true);

    foreach($cards as $card){
        Card::create($card);
    };

    $deck = Deck::create([
        'name' => fake()->username(),
        'user_id' => $user->id,
    ]);

    $formattedDeckCards = [];
    foreach ($deckCards as $cardData) {
        $formattedDeckCards[$cardData['card_id']] = ['quantity' => $cardData['quantity']];
    }

    $deck->cards()->sync($cards);
}

function populateCardsFromJson(){
    $cards = json_decode(file_get_contents(base_path('tests/Datasets/cards.json')), true);
    foreach($cards as $card){
        Card::create($card);
    }
}
