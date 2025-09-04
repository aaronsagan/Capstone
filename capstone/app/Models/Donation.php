<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'donor_id','charity_id','campaign_id','amount','purpose','is_anonymous',
        'status','proof_path','proof_type','external_ref','receipt_no','donated_at'
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'donated_at'   => 'datetime',
        'amount'       => 'decimal:2',
    ];

    public function donor(){ return $this->belongsTo(User::class,'donor_id'); }
    public function charity(){ return $this->belongsTo(Charity::class); }
    public function campaign(){ return $this->belongsTo(Campaign::class); }
}
