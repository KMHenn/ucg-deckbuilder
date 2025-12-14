<?php

pest()->group('api','cards');

describe('GET Card List', function(){
    it('gets a paginated list of cards', function(){

    });
});

describe('GET Card Filters', function(){
    it('gets available card filters and their options', function(){

    });
});

describe('GET Card', function(){
    it('gets all details for a specific card', function(){

    });

    it('can\'t get details for a card that doesn\'t exist', function(){

    });

    it('includes the logged in user\'s quantity when getting card details', function(){

    });
});

describe('POST Update Card Quantity', function(){
    it('updates the user\'s quantity of the specified card', function(){

    });

    it('can\'t update a user\'s quantity for a card that doesn\'t exist', function(){

    });

    it('can\'t update quantity without a signed in user', function(){

    });

    it('can\'t set a card quantity to less than 0', function(){

    });
});