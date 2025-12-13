<?php

namespace Database\Factories;

use App\Support\Enums\UserRolesEnum;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'username' => fake()->username(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= 'password',
            'role' => UserRolesEnum::USER->value,
            'remember_token' => Str::random(10),
        ];
    }

    public function username(string $username): self{
        return $this->state(fn(array $attributers) => [
            'username' => $username
        ]);
    }

    public function password(string $password): self{
        return $this->state(fn(array $attributes)=>[
            'password' => $password
        ]);
    }
}
