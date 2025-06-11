<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\TimeSlot;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * Display the main schedule page
     */
    public function index(Request $request)
    {
        $date = $request->get('date', now()->format('Y-m-d'));
        
        // Validate date format
        try {
            $selectedDate = Carbon::createFromFormat('Y-m-d', $date);
        } catch (\Exception $e) {
            $selectedDate = now();
            $date = $selectedDate->format('Y-m-d');
        }

        // Get active rooms and time slots
        $rooms = Room::active()->orderBy('name')->get();
        $timeSlots = TimeSlot::active()->ordered()->get();
        
        // Get approved bookings for the selected date
        $bookings = Booking::with(['user', 'room', 'timeSlot'])
            ->approved()
            ->forDate($date)
            ->get();

        // Create schedule matrix
        $schedule = $this->buildScheduleMatrix($rooms, $timeSlots, $bookings);

        return Inertia::render('Schedule/Index', [
            'date' => $date,
            'selectedDate' => $selectedDate->format('l, F j, Y'),
            'rooms' => $rooms,
            'timeSlots' => $timeSlots,
            'bookings' => $bookings,
            'schedule' => $schedule,
            'canGoToPrevious' => $selectedDate->isAfter(now()->startOfDay()),
        ]);
    }

    /**
     * Get schedule data for API calls
     */
    public function getSchedule(Request $request)
    {
        $date = $request->get('date', now()->format('Y-m-d'));
        
        $rooms = Room::active()->orderBy('name')->get();
        $timeSlots = TimeSlot::active()->ordered()->get();
        
        $bookings = Booking::with(['user', 'room', 'timeSlot'])
            ->approved()
            ->forDate($date)
            ->get();

        $schedule = $this->buildScheduleMatrix($rooms, $timeSlots, $bookings);

        return response()->json([
            'date' => $date,
            'rooms' => $rooms,
            'timeSlots' => $timeSlots,
            'bookings' => $bookings,
            'schedule' => $schedule,
        ]);
    }

    /**
     * Check availability for a specific slot
     */
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'time_slot_id' => 'required|exists:time_slots,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $isAvailable = !Booking::where('room_id', $request->room_id)
            ->where('time_slot_id', $request->time_slot_id)
            ->where('booking_date', $request->date)
            ->where('status', 'approved')
            ->exists();

        $room = Room::findOrFail($request->room_id);
        $timeSlot = TimeSlot::findOrFail($request->time_slot_id);

        return response()->json([
            'available' => $isAvailable,
            'room' => $room,
            'timeSlot' => $timeSlot,
            'date' => $request->date,
        ]);
    }

    /**
     * Build schedule matrix for easier frontend rendering
     */
    private function buildScheduleMatrix($rooms, $timeSlots, $bookings)
    {
        $matrix = [];
        
        foreach ($timeSlots as $timeSlot) {
            $row = [
                'time_slot' => $timeSlot,
                'slots' => []
            ];
            
            foreach ($rooms as $room) {
                // Find booking for this time slot and room
                $booking = $bookings->first(function ($booking) use ($room, $timeSlot) {
                    return $booking->room_id === $room->id && 
                           $booking->time_slot_id === $timeSlot->id;
                });
                
                $row['slots'][] = [
                    'room_id' => $room->id,
                    'time_slot_id' => $timeSlot->id,
                    'is_booked' => $booking !== null,
                    'booking' => $booking,
                    'is_available' => $booking === null && $room->is_active && $timeSlot->is_active,
                ];
            }
            
            $matrix[] = $row;
        }
        
        return $matrix;
    }
}