<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'capacity' => $this->capacity,
            'facilities' => $this->facilities,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Include bookings if loaded
            'recent_bookings' => $this->whenLoaded('bookings', function () {
                return $this->bookings->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'date' => $booking->date,
                        'status' => $booking->status,
                        'user_name' => $booking->user->name,
                        'time_slot' => $booking->timeSlot->start_time . ' - ' . $booking->timeSlot->end_time,
                    ];
                });
            }),
        ];
    }
}