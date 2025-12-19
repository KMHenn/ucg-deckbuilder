<?php

pest()->group('api','decks');

beforeEach(function(){
    populateDeckFromJson();
});