<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function registerDonor(Request $r){
        $data = $r->validate([
            'name'=>'required|string|max:255',
            'email'=>'required|email|unique:users',
            'password'=>'required|min:6|confirmed',
            'phone'=>'nullable|string'
        ]);
        $user = User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>Hash::make($data['password']),
            'phone'=>$data['phone'] ?? null,
            'role'=>'donor'
        ]);
        return response()->json($user, 201);
    }

    public function registerCharityAdmin(Request $r){
        $data = $r->validate([
            'name'=>'required|string|max:255',
            'email'=>'required|email|unique:users',
            'password'=>'required|min:6|confirmed',
            'phone'=>'nullable|string'
        ]);
        $user = User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>Hash::make($data['password']),
            'phone'=>$data['phone'] ?? null,
            'role'=>'charity_admin'
        ]);
        return response()->json($user, 201);
    }

    public function login(Request $r){
        $data = $r->validate([
            'email'=>'required|email',
            'password'=>'required'
        ]);
        $user = User::where('email',$data['email'])->first();
        if(!$user || !Hash::check($data['password'], $user->password) || $user->status!=='active'){
            return response()->json(['message'=>'Invalid credentials'], 401);
        }
        $token = $user->createToken('auth')->plainTextToken;
        return response()->json(['token'=>$token,'user'=>$user]);
    }

    public function logout(Request $r){
        $r->user()->currentAccessToken()->delete();
        return response()->json(['message'=>'Logged out']);
    }

    public function me(Request $r){
        return response()->json($r->user());
    }

    public function updateProfile(Request $r){
        $user = $r->user();
        $user->update($r->validate([
            'name'=>'sometimes|string|max:255',
            'phone'=>'sometimes|nullable|string'
        ]));
        return response()->json($user);
    }
}
