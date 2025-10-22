<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('rarity');
            $table->integer('level')->nullable();
            $table->string('type')->nullable();
            $table->string('feature')->nullable();
            $table->string('round')->nullable();
            $table->json('bp_ranks')->nullable();
            $table->mediumText('effect')->nullable();
            $table->string('character_name')->nullable();
            $table->string('subtitle')->nullable();
            $table->string('participating_works')->nullable();
            $table->string('image_url')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->string('section');
            $table->string('bundle')->nullable();
            $table->string('serial');
            $table->string('branch')->nullable();
            $table->string('number')->nullable();
            $table->string('errata_url')->nullable();
            $table->date('ascended_date')->nullable();
            $table->boolean('override_card_limit')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
