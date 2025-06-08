<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    // Field yang boleh diisi mass assignment
    protected $fillable = [
        'name',
        'capacity', 
        'facilities',
        'is_active'
    ];

    // Cast tipe data
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relationship: Room has many bookings
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Scope: Hanya ruangan yang aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}