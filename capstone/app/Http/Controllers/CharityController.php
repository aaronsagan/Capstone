<?php

namespace App\Http\Controllers;

use App\Models\{Charity, CharityDocument, DonationChannel};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CharityController extends Controller
{
    // Public directory
    public function index(Request $r){
        $q = Charity::query()->where('verification_status','approved');
        if($term = $r->query('q')) $q->where('name','like',"%$term%");
        return $q->latest()->paginate(12);
    }

    public function show(Charity $charity){
        return $charity->loadCount(['donations as total_received'=>function($q){
            $q->where('status','completed')->select(\DB::raw('coalesce(sum(amount),0)'));
        }]);
    }

    // Charity Admin creates their org
    public function store(Request $r){
        $r->validate(['name'=>'required|string|max:255']);
        $charity = Charity::create([
            'owner_id'=>$r->user()->id,
            'name'=>$r->input('name'),
            'mission'=>$r->input('mission'),
            'contact_email'=>$r->input('contact_email'),
            'contact_phone'=>$r->input('contact_phone'),
        ]);
        return response()->json($charity,201);
    }

    // Update org
    public function update(Request $r, Charity $charity){
        abort_unless($charity->owner_id === $r->user()->id, 403);
        $charity->update($r->only(['name','mission','vision','website','contact_email','contact_phone']));
        return $charity;
    }

    // Upload verification doc
    public function uploadDocument(Request $r, Charity $charity){
        abort_unless($charity->owner_id === $r->user()->id, 403);
        $data = $r->validate([
            'doc_type'=>'required|in:registration,tax,bylaws,audit,other',
            'file'=>'required|file|mimes:pdf,jpg,jpeg,png'
        ]);
        $path = $r->file('file')->store('charity_docs','public');
        $hash = hash_file('sha256', $r->file('file')->getRealPath());
        $doc = $charity->documents()->create([
            'doc_type'=>$data['doc_type'],
            'file_path'=>$path,
            'sha256'=>$hash,
            'uploaded_by'=>$r->user()->id
        ]);
        return response()->json($doc,201);
    }

    // Donation channels (GCash/PayPal/Bank display-only)
    public function channels(Charity $charity){ return $charity->channels; }

    public function storeChannel(Request $r, Charity $charity){
        abort_unless($charity->owner_id === $r->user()->id, 403);
        $data = $r->validate([
            'type'=>'required|in:gcash,paypal,bank,other',
            'label'=>'required|string|max:255',
            'details'=>'required|array'
        ]);
        return $charity->channels()->create([
            'type'=>$data['type'],
            'label'=>$data['label'],
            'details'=>$data['details'],
        ]);
    }
}
