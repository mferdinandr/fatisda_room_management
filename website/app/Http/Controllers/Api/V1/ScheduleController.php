<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\TimeSlot;
use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    /**
     * Get schedule for specific date
     */
    public function index(Request $request)
    {
        $request->validate([
            'date' => 'nullable|date',
        ]);

        $date = $request->get('date', now()->format('Y-m-d'));
        
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

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $date,
                'formatted_date' => $selectedDate->format('l, F j, Y'),
                'rooms' => $rooms,
                'time_slots' => $timeSlots,
                'bookings' => $bookings,
                'schedule' => $schedule,
                'stats' => [
                    'total_slots' => $rooms->count() * $timeSlots->count(),
                    'booked_slots' => $bookings->count(),
                    'available_slots' => ($rooms->count() * $timeSlots->count()) - $bookings->count(),
                ]
            ],
            'message' => 'Schedule retrieved successfully'
        ]);
    }

    /**
     * Get schedule for date range (for calendar view)
     */
    public function range(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = $request->start_date;
        $endDate = $request->end_date;

        // Get bookings in date range
        $bookings = Booking::with(['user', 'room', 'timeSlot'])
            ->approved()
            ->whereBetween('booking_date', [$startDate, $endDate])
            ->get()
            ->groupBy('booking_date');

        // Format for calendar
        $calendarEvents = [];
        foreach ($bookings as $date => $dayBookings) {
            foreach ($dayBookings as $booking) {
                $calendarEvents[] = [
                    'id' => $booking->id,
                    'title' => $booking->mata_kuliah ?: ($booking->keperluan === 'rapat' ? 'Meeting' : 'Event'),
                    'start' => $date . 'T' . $booking->timeSlot->start_time,
                    'end' => $date . 'T' . $booking->timeSlot->end_time,
                    'room' => $booking->room->name,
                    'lecturer' => $booking->dosen,
                    'user' => $booking->user->name,
                    'purpose' => $booking->keperluan,
                    'status' => $booking->status,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'events' => $calendarEvents,
                'summary' => [
                    'total_events' => count($calendarEvents),
                    'dates_with_events' => $bookings->keys()->count(),
                ]
            ],
            'message' => 'Schedule range retrieved successfully'
        ]);
    }

    /**
     * Check availability for specific slot
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
            'success' => true,
            'data' => [
                'available' => $isAvailable,
                'room' => $room,
                'time_slot' => $timeSlot,
                'date' => $request->date,
                'message' => $isAvailable ? 'Slot is available' : 'Slot is already booked'
            ],
            'message' => 'Availability checked successfully'
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