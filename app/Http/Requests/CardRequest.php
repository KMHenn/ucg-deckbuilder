<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CardRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'format' => ['nullable'],
            'per_page' => ['numeric', 'integer', 'min:1'],
            'page_number' => ['numeric', 'integer', 'min:1'],
            'participating_works' => ['nullable', 'exists:cards'],
            'rarity' => ['nullable','exists:cards'],
            'feature' => ['nullable', 'exists:cards'],
            'level' => ['nullable', 'exists:cards'],
            'round' => ['nullable', 'exists:cards'],
            'character_name' => ['nullable', 'exists:cards'],
            'type' => ['nullable', 'exists:cards']

        ];
    }
}
