<?php

namespace App\Traits;

trait IsCardResource
{
    private function getDetailsForCard(): array{
        $details = [$this->formattedFeature()];
        if($this->feature === 'scene'){
            return array_merge(
                $details, 
                ['Round ' . $this->round]
            );
        }

        return array_merge(
            $details, 
            [
                ucfirst($this->type),
                'Level ' . $this->level,
            ]
        );
    }
}
