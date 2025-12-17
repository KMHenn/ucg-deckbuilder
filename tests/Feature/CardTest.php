<?php

use App\Models\User;
use App\Models\Card;

pest()->group('api','cards');

beforeEach(function(){
    populateCardsFromJson();
});

describe('GET /cards', function(){
    it('gets a paginated list of cards', function(){
        $response = $this->getJson('/cards');
        $response->assertOk();

        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'formatted_name',
                    'number',
                    'thumbnail_url',
                    'tags',
                    'override_card_limit',
                ]
            ]
        ]);
    });

    it('gets a card list and the signed in user\'s quantity', function(){
        $user = User::factory()->create();
        signIn($user);

        $response = $this->withSession([])->getJson('/cards');
        $response->assertOk();

        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'formatted_name',
                    'number',
                    'thumbnail_url',
                    'tags',
                    'override_card_limit',
                    'quantity'
                ]
            ]
        ]);
    });
})->group('list-cards');

describe('GET /cards/filters', function(){
    it('gets available card filters and their options', function(){
        $response = $this->getJson('/cards/filters');
        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'label',
                    'options' => [
                        '*' => [
                            'value',
                            'label'
                        ]
                    ]
                ]
            ],
            'meta' => [
                'filter_count'
            ]
        ]);
    });
})->group('filters');

describe('GET /cards/{card}', function(){
    it('gets all details for a specific card', function(){
        $card = Card::inRandomOrder()->limit(1)->first();
        $response = $this->getJson("cards/{$card->id}");
        $response->assertOk();
        $response->assertJson([
            'data' => [
                'id' => $card->id,
                'formatted_name' => $card->formattedName(),
                'number' => $card->number,
                'thumbnail_url' => $card->thumbnail_url,
                'tags' => $card->getDetailsArray(),
                'override_card_limit' => $card->override_card_limit,
                'name' => $card->name,
                'subtitle' => $card->subtitle,
                'round' => $card->round,
                'level' => $card->level,
                'effect' => $card->effect,
                'feature' => $card->feature,
                'rarity' => $card->rarity,
                'participating_works' => $card->participating_works,
                'quantity' => null,
                'section' => $card->section,
                'bundle' => $card->bundle,
                'character_name' => $card->character_name,
                'errata' => $card->errata_url,
                'ascended' => !is_null($card->ascended_date),
                'related_cards' => !is_null($card->branch) ? $card->getRelatedCards()->toArray() : [],
            ]
        ]);
    });

    it('can\'t get details for a card that doesn\'t exist', function(){
        $response = $this->getJson("cards/fakeCardId");
        $response->assertNotFound();
    });

    it('includes the logged in user\'s quantity when getting card details', function(){
        $user = User::factory()->create();
        signIn($user);
        $card = Card::inRandomOrder()->limit(1)->first();
        $response = $this->withSession([])->getJson("cards/{$card->id}");
        $response->assertOk();
        $response->assertJson([
            'data' => [
                'id' => $card->id,
                'formatted_name' => $card->formattedName(),
                'number' => $card->number,
                'thumbnail_url' => $card->thumbnail_url,
                'tags' => $card->getDetailsArray(),
                'override_card_limit' => $card->override_card_limit,
                'name' => $card->name,
                'subtitle' => $card->subtitle,
                'round' => $card->round,
                'level' => $card->level,
                'effect' => $card->effect,
                'feature' => $card->feature,
                'rarity' => $card->rarity,
                'participating_works' => $card->participating_works,
                'quantity' => $user->cardQuantity($card->id),
                'section' => $card->section,
                'bundle' => $card->bundle,
                'character_name' => $card->character_name,
                'errata' => $card->errata_url,
                'ascended' => !is_null($card->ascended_date),
                'related_cards' => !is_null($card->branch) ? $card->getRelatedCards()->toArray() : [],
            ]
        ]);
    });
})->group('card-details');

describe('POST /cards/{card}/quantity', function(){
    it('updates the user\'s quantity of the specified card', function(){
        $user = User::factory()->create();
        signIn($user);
        
        $card = Card::inRandomOrder()->limit(1)->first();
        $input = [
            'quantity' => rand(1, 5)
        ];
        $response = $this->withSession([])->postJson("cards/{$card->id}/quantity", $input);
        
        $response->assertOk();
        $this->assertEquals($user->cardQuantity($card->id), $input['quantity']);
    });

    it('can\'t update a user\'s quantity for a card that doesn\'t exist', function(){
        $user = User::factory()->create();
        signIn($user);

        $input = [
            'quantity' => rand(1, 5)
        ];
        $response = $this->withSession([])->postJson("cards/fakeCardId/quantity", $input);
        $response->assertNotFound();
    });

    it('can\'t update quantity without a signed in user', function(){
        $card = Card::inRandomOrder()->limit(1)->first();
        $input = [
            'quantity' => rand(1, 5)
        ];

        $response = $this->withSession([])->postJson("cards/{$card->id}/quantity", $input);
        $response->assertUnauthorized();
    });

    it('can\'t set a card quantity to less than 0', function(){
        $user = User::factory()->create();
        signIn($user);
        
        $card = Card::inRandomOrder()->limit(1)->first();
        $input = [
            'quantity' => rand(-10, -1)
        ];
        $response = $this->withSession([])->postJson("cards/{$card->id}/quantity", $input);
        
        $response->assertInvalid('quantity');
    });

    it('can\'t set a card quantity to a non-numeric value', function(){
        $user = User::factory()->create();
        signIn($user);
        
        $card = Card::inRandomOrder()->limit(1)->first();
        $input = [
            'quantity' => 'someString'
        ];
        $response = $this->withSession([])->postJson("cards/{$card->id}/quantity", $input);
        
        $response->assertInvalid('quantity');
    });

    it('can\'t set a card quantity to a non-integer value', function(){
        $user = User::factory()->create();
        signIn($user);
        
        $card = Card::inRandomOrder()->limit(1)->first();
        $input = [
            'quantity' => 0.5
        ];
        $response = $this->withSession([])->postJson("cards/{$card->id}/quantity", $input);
        
        $response->assertInvalid('quantity');
    });

    it('can\'t update a card quantity without a quantity', function(){
        $user = User::factory()->create();
        signIn($user);
        
        $card = Card::inRandomOrder()->limit(1)->first();
        $input = [
            'quantity' => null
        ];
        $response = $this->withSession([])->postJson("cards/{$card->id}/quantity", $input);
        
        $response->assertInvalid('quantity');
    });
})->group('set-user-qty');