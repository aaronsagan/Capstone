<?php

namespace App\Http\Controllers;

use App\Models\{Donation, Charity, Campaign};
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    // Donor creates pledge
    public function store(Request $r){
        $data = $r->validate([
            'charity_id'=>'required|exists:charities,id',
            'campaign_id'=>'nullable|exists:campaigns,id',
            'amount'=>'required|numeric|min:1',
            'purpose'=>'nullable|in:general,project,emergency',
            'is_anonymous'=>'boolean',
            'external_ref'=>'nullable|string|max:64'
        ]);
        $donation = Donation::create([
            'donor_id' => ($r->boolean('is_anonymous') ? null : $r->user()->id),
            'charity_id'=>$data['charity_id'],
            'campaign_id'=>$data['campaign_id'] ?? null,
            'amount'=>$data['amount'],
            'purpose'=>$data['purpose'] ?? 'general',
            'is_anonymous'=>$data['is_anonymous'] ?? false,
            'status'=>'pending',
            'external_ref'=>$data['external_ref'] ?? null,
        ]);
        return response()->json($donation,201);
    }

    // Donor uploads proof (image/pdf)
    public function uploadProof(Request $r, Donation $donation){
        abort_unless($donation->donor_id === $r->user()->id || $donation->donor_id===null, 403);
        $r->validate(['file'=>'required|file|mimes:jpg,jpeg,png,pdf','proof_type'=>'nullable|string|max:50']);
        $path = $r->file('file')->store('proofs','public');
        $donation->update(['proof_path'=>$path,'proof_type'=>$r->input('proof_type')]);
        return $donation->fresh();
    }

    // Charity inbox (see donations for their org)
    public function charityInbox(Request $r, Charity $charity){
        abort_unless($charity->owner_id === $r->user()->id, 403);
        return $charity->donations()->latest()->paginate(20);
    }

    // Charity confirms or rejects donation
    public function confirm(Request $r, Donation $donation){
        abort_unless($donation->charity->owner_id === $r->user()->id, 403);
        $data = $r->validate(['status'=>'required|in:completed,rejected']);
        $donation->update([
            'status'=>$data['status'],
            'receipt_no'=> $data['status']==='completed' ? Str::upper(Str::random(10)) : null
        ]);
        return $donation->fresh();
    }

    // Donor: my donations
    public function myDonations(Request $r){
        return $r->user()->donations()->latest()->paginate(20);
    }
}
