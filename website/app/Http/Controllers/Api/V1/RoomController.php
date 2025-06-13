<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of active rooms.
     */
    public function index()
    {
        $rooms = Room::active()->orderBy('name')->get();
        
        return response()->json([
            'success' => true,
            'data' => $rooms,
            'message' => 'Rooms retrieved successfully'
        ]);
    }

    /**
     * Display the specified room.
     */
    public function show(Room $room)
    {
        return response()->json([
            'success' => true,
            'data' => $room,
            'message' => 'Room retrieved successfully'
        ]);
    }

    /**
     * Get room with availability for specific date.
     */
    public function availability(Request $request, Room $room)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $date = $request->date;
        
        // Get time slots for this room on the specified date
        $timeSlots = $room->timeSlots()
            ->active()
            ->with(['bookings' => function ($query) use ($date) {
                $query->where('booking_date', $date)
                      ->where('status', 'approved');
            }])
            ->orderBy('start_time')
            ->get();

        // Add availability status to each time slot
        $timeSlots = $timeSlots->map(function ($timeSlot) use ($room, $date) {
            $isBooked = $timeSlot->bookings->isNotEmpty();
            
            return [
                'id' => $timeSlot->id,
                'start_time' => $timeSlot->start_time,
                'end_time' => $timeSlot->end_time,
                'label' => $timeSlot->label,
                'is_active' => $timeSlot->is_active,
                'is_available' => !$isBooked && $timeSlot->is_active,
                'is_booked' => $isBooked,
                'booking' => $isBooked ? $timeSlot->bookings->first() : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'room' => $room,
                'date' => $date,
                'time_slots' => $timeSlots,
            ],
            'message' => 'Room availability retrieved successfully'
        ]);
    }
}