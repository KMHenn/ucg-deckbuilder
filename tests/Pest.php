<?php

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

const ROUTE_ROOT = 'api/v1';

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

function signIn($user = null)
{
    $user = $user ?? \App\Models\User::factory()->create();

    test()->actingAs($user);

    return $user;
}

/*
|--------------------------------------------------------------------------
| Custom Expectations
|--------------------------------------------------------------------------
|
| Example:
| expect($value)->toBeOne();
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});
