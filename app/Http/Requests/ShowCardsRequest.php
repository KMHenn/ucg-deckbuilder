<?php

namespace App\Http\Requests;

use App\Rules\ValidSectionAndBundle;
use Illuminate\Foundation\Http\FormRequest;

class ShowCardsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'per_page' => ['numeric', 'integer', 'min:1'],
            'page' => ['numeric', 'integer', 'min:1'],
            'include_ascended' => ['nullable','boolean'],

            'search' => ['nullable', 'string', 'max:255'],

            'participating_works' => ['nullable', 'array'],
            'participating_works.*' => ['string', 'exists:cards,participating_works'],

            'rarity' => ['nullable', 'array'],
            'rarity.*' => ['string', 'exists:cards,rarity'],

            'feature' => ['nullable', 'array'],
            'feature.*' => ['string', 'exists:cards,feature'],

            'level' => ['nullable', 'array'],
            'level.*' => ['string', 'exists:cards,level'],

            'round' => ['nullable', 'array'],
            'round.*' => ['string', 'exists:cards,round'],

            'character_name' => ['nullable', 'array'],
            'character_name.*' => ['string', 'exists:cards,character_name'],

            'type' => ['nullable', 'array'],
            'type.*' => ['string', 'exists:cards,type'],

            'section_bundle' => ['nullable', 'array'],
            'section_bundle.*' => ['string', new ValidSectionAndBundle()]
        ];
    }
}
