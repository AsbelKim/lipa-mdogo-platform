<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Device extends Model
{
    protected $fillable = [
        'company_id', 'category', 'brand', 'model', 'specs',
        'imei', 'serial_number', 'colour', 'unit_cost', 'status', 'current_agent_id'
    ];

    protected $casts = [
        'specs' => 'array',
        'unit_cost' => 'decimal:2',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function currentAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'current_agent_id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(DeviceAssignment::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function statusEvents(): HasMany
    {
        return $this->hasMany(DeviceStatusEvent::class);
    }

    public function locationPings(): HasMany
    {
        return $this->hasMany(DeviceLocationPing::class);
    }
}
