<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{User, Charity, DonationChannel, Campaign};

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::where('email', 'charityadmin@example.com')->first();

        // Verified charity so it appears in public lists
        $charity = Charity::firstOrCreate(
            ['name' => 'HopeWorks Foundation'],
            [
                'owner_id' => $owner->id,
                'mission' => 'Transparent community support.',
                'contact_email' => 'contact@hopeworks.org',
                'verification_status' => 'approved',
            ]
        );

        // Display-only donation channel (e.g., GCash)
        DonationChannel::firstOrCreate(
            ['charity_id' => $charity->id, 'label' => 'GCash Main'],
            ['type' => 'gcash', 'details' => ['number' => '09171234567', 'account_name' => 'HopeWorks'], 'is_active' => true]
        );

        // One published campaign
        Campaign::firstOrCreate(
            ['charity_id' => $charity->id, 'title' => 'School Kits 2025'],
            ['description' => 'Provide school kits to 500 students.',
             'target_amount' => 250000, 'status' => 'published']
        );
    }
}
