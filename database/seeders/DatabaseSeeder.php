<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Card;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(['username' => 'admin'],
            [
                'password' => env('DEFAULT_PASSWORD'),
                'role' => \App\Support\Enums\UserRolesEnum::ADMIN->value
            ]
        );


        if(Card::count() === 0){
            Artisan::call('app:sync-card-data');
        }
    }
}
