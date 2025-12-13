<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use App\Support\Enums\UserRolesEnum;
use Dedoc\Scramble\Attributes\Group;

#[Group('Auth', weight: 0)]
class RegisterController extends Controller
{
    /**
     * POST Register
     * 
     */
    public function __invoke(Request $request)
    {
        // @TODO optional email
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => UserRolesEnum::USER->value,
        ]);

        Auth::login($user);

        return (new UserResource($user))->response()->setStatusCode(201);
    }
}
