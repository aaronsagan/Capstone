<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = ['name','email','password','phone','role','status'];
    protected $hidden = ['password','remember_token'];

    public function charities(){ return $this->hasMany(Charity::class, 'owner_id'); }
    public function donations(){ return $this->hasMany(Donation::class, 'donor_id'); }
}
