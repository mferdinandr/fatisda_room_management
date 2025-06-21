<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    // Field yang boleh diisi mass assignment
    protected $fillable = [
        'user_id',
        'room_id',
        'time_slot_id',
        'booking_date',
        'keperluan',
        'mata_kuliah',
        'dosen',
        'catatan',
        'status',
        'admin_notes',
        'color'
    ];

    // Cast tipe data
    protected $casts = [
        'booking_date' => 'date',
    ];

    /**
     * Relationship: Booking belongs to User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: Booking belongs to Room
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Relationship: Booking belongs to TimeSlot
     */
    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class);
    }

    /**
     * Scope: Hanya booking yang approved
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope: Hanya booking yang pending
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: Filter berdasarkan tanggal
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('booking_date', $date);
    }

    public static function generateRandomColor()
    {
        $colors = [
            '#3B82F6', // Blue
            '#EF4444', // Red  
            '#10B981', // Green
            '#F59E0B', // Yellow
            '#8B5CF6', // Purple
            '#F97316', // Orange
            '#06B6D4', // Cyan
            '#84CC16', // Lime
        ];
        
        return $colors[array_rand($colors)];
    }
}

