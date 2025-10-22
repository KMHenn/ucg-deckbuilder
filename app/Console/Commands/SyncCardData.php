<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Card;
use App\Models\Errata;

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
    protected $description = 'Query the UCG API endpoint to get a full refresh of card data.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $endpoint = config('ucg.api.root') . config('ucg.api.card-list') . '?page=1';
        $client = new \GuzzleHttp\Client;

        $this->info('Reading card data from UCG...');
        do{
            $this->output->text('Reading ' . $endpoint);
            $response = $client->get($endpoint);
            $jsonArray = json_decode($response->getBody(), true);
            $cardsFound = count($jsonArray['data']);
            $this->output->text($cardsFound . ' cards found.');
            $this->output->progressStart($cardsFound);
            
            foreach($jsonArray['data'] as $card){
                $bpData = null;
                if($card['feature']['value'] !== 'scene'){
                    $bpData = [
                        $card['battle_power_1'],
                        $card['battle_power_2'],
                        $card['battle_power_3'],
                        $card['battle_power_ex'],
                    ];
                }

                if($card['detail']['character_name'] === '-'){
                    $card['detail']['character_name'] = null;
                }

                if($card['detail']['effect'] === '-'){
                    $card['detail']['effect'] = null;
                }

                $cardModel = Card::updateOrCreate([
                    'id' => $card['id']
                ],
                [
                    'name' => $card['detail']['name'] ,
                    'rarity' => $card['rarity']['description'] ?? null,
                    'level' => $card['level'],
                    'type' => $card['type']['value'] ?? null,
                    'feature' => $card['feature']['value'] ?? null,
                    'round' => $card['round'] ?? null,
                    'bp_ranks' => $bpData,
                    'effect' => $card['detail']['effect'] ?? null,
                    'character_name' => $card['detail']['character_name']?? null,
                    'subtitle' => $card['detail']['type_name']?? null,
                    'participating_works' => $card['detail']['participating_works']?? null,
                    'image_url' => $card['detail']['image_url'],
                    'thumbnail_url' => $card['detail']['thumbnail_image_url'],
                    'section' => $card['section']?? null,
                    'bundle' => $card['bundle_version'],
                    'serial' => $card['serial'],
                    'branch' => $card['branch'],
                    'number' => $card['number'],
                    'errata_url' => $card['detail']['errata_url'] ?? null,
                    'override_card_limit' => str_contains($card['detail']['effect'], 'A deck may include any number of this card.') ? 1 : 0
                ]);

                $this->output->progressAdvance();
            }

            $this->output->progressFinish();
            $endpoint = $jsonArray['links']['next'];
        } while(array_key_exists('links', $jsonArray) && !is_null($jsonArray['links']['next']));
    }
}
