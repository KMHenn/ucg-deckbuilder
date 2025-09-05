<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SyncCardData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-card-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $endpoint = config('ucg.api.root') . config('ucg.api.card-list');
        $getParams = [
            'page' => 1,
            'per_page' => 100,
        ];
    }
}
