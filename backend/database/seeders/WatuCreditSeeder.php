<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Seeder;

class WatuCreditSeeder extends Seeder
{
    public function run(): void
    {
        $watuCredit = Company::create([
            'name' => 'Watu Credit',
            'email' => 'admin@watucredit.co.ke',
            'phone' => '+254 701 234 567',
            'subscription_status' => 'active',
        ]);

        User::create([
            'company_id' => $watuCredit->id,
            'name' => 'Admin User',
            'email' => 'admin@watucredit.co.ke',
            'phone' => '+254 701 234 567',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::create([
            'company_id' => $watuCredit->id,
            'name' => 'Operations Staff',
            'email' => 'ops@watucredit.co.ke',
            'phone' => '+254 702 345 678',
            'password' => bcrypt('password'),
            'role' => 'staff',
            'status' => 'active',
        ]);

        User::create([
            'company_id' => $watuCredit->id,
            'name' => 'Sales Agent 1',
            'email' => 'agent1@watucredit.co.ke',
            'phone' => '+254 703 456 789',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'status' => 'active',
        ]);

        User::create([
            'company_id' => $watuCredit->id,
            'name' => 'Sales Agent 2',
            'email' => 'agent2@watucredit.co.ke',
            'phone' => '+254 704 567 890',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'status' => 'active',
        ]);
    }
}
