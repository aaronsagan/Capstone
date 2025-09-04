<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
  AuthController, CharityController, CampaignController, DonationController, FundUsageController
};
use App\Http\Controllers\Admin\VerificationController;

// Health
Route::get('/ping', fn () => ['ok' => true, 'time' => now()->toDateTimeString()]);

// Auth
Route::post('/auth/register', [AuthController::class,'registerDonor']);
Route::post('/auth/register-charity', [AuthController::class,'registerCharityAdmin']);
Route::post('/auth/login', [AuthController::class,'login']);
Route::post('/auth/logout', [AuthController::class,'logout'])->middleware('auth:sanctum');
Route::get('/me', [AuthController::class,'me'])->middleware('auth:sanctum');
Route::put('/me', [AuthController::class,'updateProfile'])->middleware('auth:sanctum');

// Public directory
Route::get('/charities', [CharityController::class,'index']);
Route::get('/charities/{charity}', [CharityController::class,'show']);
Route::get('/charities/{charity}/channels', [CharityController::class,'channels']);
Route::get('/charities/{charity}/campaigns', [CampaignController::class,'index']);
Route::get('/campaigns/{campaign}', [CampaignController::class,'show']);
Route::get('/campaigns/{campaign}/fund-usage', [FundUsageController::class,'publicIndex']);

// Donor actions
Route::middleware(['auth:sanctum','role:donor'])->group(function(){
  Route::post('/donations', [DonationController::class,'store']);
  Route::post('/donations/{donation}/proof', [DonationController::class,'uploadProof']);
  Route::get('/me/donations', [DonationController::class,'myDonations']);
});

// Charity admin
Route::middleware(['auth:sanctum','role:charity_admin'])->group(function(){
  Route::post('/charities', [CharityController::class,'store']);
  Route::put('/charities/{charity}', [CharityController::class,'update']);
  Route::post('/charities/{charity}/documents', [CharityController::class,'uploadDocument']);

  Route::post('/charities/{charity}/channels', [CharityController::class,'storeChannel']);

  Route::post('/charities/{charity}/campaigns', [CampaignController::class,'store']);
  Route::put('/campaigns/{campaign}', [CampaignController::class,'update']);
  Route::delete('/campaigns/{campaign}', [CampaignController::class,'destroy']);

  Route::get('/charities/{charity}/donations', [DonationController::class,'charityInbox']);
  Route::patch('/donations/{donation}/confirm', [DonationController::class,'confirm']);

  Route::post('/campaigns/{campaign}/fund-usage', [FundUsageController::class,'store']);
});

// System admin
Route::middleware(['auth:sanctum','role:admin'])->group(function(){
  Route::get('/admin/verifications', [VerificationController::class,'index']);
  Route::patch('/admin/charities/{charity}/approve', [VerificationController::class,'approve']);
  Route::patch('/admin/charities/{charity}/reject', [VerificationController::class,'reject']);
  Route::patch('/admin/users/{user}/suspend', [VerificationController::class,'suspendUser']);
});

// routes/api.php
Route::get('/metrics', function () {
    return [
        'charities' => \App\Models\Charity::where('verification_status','approved')->count(),
        'campaigns' => \App\Models\Campaign::count(),
        'donations' => \App\Models\Donation::count(), // or sum('amount') if you want total amount
    ];
});
