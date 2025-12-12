<?php

namespace App\Rules;

use Closure;
use App\Models\Card;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidSectionAndBundle implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        [$section, $bundle] = array_pad(explode('-', $value), 2, null);
        $exists = Card::where('section', $section)
            ->when(!is_null($bundle), fn($q) => $q->where('bundle', $bundle))
            ->when(is_null($bundle), fn($q) => $q->whereNull('bundle'))
            ->exists();

        if(!$exists){
            $fail("The value '{$value}' is not a valid section-bundle combination.");
        }
    }
}
