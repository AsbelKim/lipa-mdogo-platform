<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    protected $fillable = [
        'company_id', 'device_id', 'customer_id', 'agent_id',
        'down_payment', 'total_price', 'installment_amount',
        'installment_frequency', 'start_date', 'status'
    ];

    protected $casts = [
        'down_payment' => 'decimal:2',
        'total_price' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'start_date' => 'date',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function getTotalPaidAttribute(): float
    {
        return $this->payments()->sum('amount');
    }

    public function getRemainingBalanceAttribute(): float
    {
        return $this->total_price - $this->total_paid;
    }
}
