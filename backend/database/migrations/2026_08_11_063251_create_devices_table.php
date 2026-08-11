<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->enum('category', ['phone', 'solar', 'radio', 'tv', 'other'])->default('phone');
            $table->string('brand');
            $table->string('model');
            $table->json('specs')->nullable();
            $table->string('imei')->nullable()->unique();
            $table->string('serial_number')->unique();
            $table->string('colour')->nullable();
            $table->decimal('unit_cost', 10, 2);
            $table->enum('status', ['in_stock', 'assigned', 'sold', 'repossessed', 'lost'])->default('in_stock');
            $table->foreignId('current_agent_id')->nullable()->constrained('users')->nullifyOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
