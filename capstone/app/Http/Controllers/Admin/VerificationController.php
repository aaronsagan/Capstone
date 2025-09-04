<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Charity;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function index(){
        return Charity::where('verification_status','pending')->latest()->paginate(20);
    }

    public function approve(Request $r, Charity $charity){
        $charity->update([
            'verification_status'=>'approved',
            'verified_at'=>now(),
            'verification_notes'=>$r->input('notes')
        ]);
        return response()->json(['message'=>'Approved']);
    }

    public function reject(Request $r, Charity $charity){
        $charity->update([
            'verification_status'=>'rejected',
            'verification_notes'=>$r->input('notes')
        ]);
        return response()->json(['message'=>'Rejected']);
    }

    public function suspendUser(Request $r, \App\Models\User $user){
        $user->update(['status'=>'suspended']);
        return response()->json(['message'=>'User suspended']);
    }
}
