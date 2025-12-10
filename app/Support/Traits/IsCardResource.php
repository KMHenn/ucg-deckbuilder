<?php

namespace App\Support\Traits;

trait IsCardResource
{
    private function getDetailsForCard(): array{
        $details = [
            'Feature' => $this->formattedFeature(),
            'Rarity' => $this->rarity,
            'Participating Works' => $this->participating_works,
            'Release' => $this->section === 'PR' ? $this->section : sprintf('%s-%s', $this->section, $this->bundle),
        ];
        if($this->feature === 'scene'){
            return array_merge(
                $details, 
                ['Round' => 'Round ' . $this->round],
            );
        }

        return array_merge(
            $details, 
            [
                'Type' => ucfirst($this->type),
                'Level' => 'Level ' . $this->level,
                'Character' => $this->character_name,
            ]
        );
    }
}
