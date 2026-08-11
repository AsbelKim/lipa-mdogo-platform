<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['company_id', 'name', 'phone', 'email', 'password', 'role', 'status'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function assignedDevices(): HasMany
    {
        return $this->hasMany(DeviceAssignment::class, 'agent_id');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class, 'agent_id');
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'agent_id');
    }

    public function paymentsRecorded(): HasMany
    {
        return $this->hasMany(Payment::class, 'recorded_by');
    }
}
