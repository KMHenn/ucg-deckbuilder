<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse{
        $credentials = $request->validate([
            'username' => 'required|string|exists:users,username',
            'password' => 'required|string',
        ]);

        if(Auth::attempt($credentials, $request->boolean('remember'))){
            $request->session()->regenerate();
            return new JsonResponse(['message' => 'success']);
        }

        return new JsonResponse(['message' => 'failed']);
    }

    public function logout(Request $request): JsonResponse{
        Auth::logout();

        // Invalidate session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return new JsonResponse(['message' => 'success']);
    }

    public function register(Request $request){
        // @TODO
        return redirect('/');
    }
    
}
