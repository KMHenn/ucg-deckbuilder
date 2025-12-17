<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Support\Facades\Auth;

#[Group('Auth', weight: 0)]
class LogoutController extends Controller
{
    /**
     * POST Logout
     */
    public function __invoke(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'You are not logged in.'], 401);
        }
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }
}
