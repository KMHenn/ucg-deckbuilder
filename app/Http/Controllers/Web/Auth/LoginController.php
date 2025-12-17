<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Resources\UserResource;

#[Group('Auth', weight: 0)]
class LoginController extends Controller
{
    /**
     * POST Login
     */
    public function __invoke(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string', 'exists:users,username'],
            'password' => ['required'],
            ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        $request->session()->regenerate();

        return (new UserResource(Auth::user()))->response();
    }
}
