<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Room;
use App\Models\TimeSlot;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Display user's bookings.
     */
    public function index(Request $request)
    {
        $query = Booking::with(['room', 'timeSlot'])
            ->where('user_id', auth()->id());

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('from_date')) {
            $query->whereDate('booking_date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('booking_date', '<=', $request->to_date);
        }

        $bookings = $query->orderBy('booking_date', 'desc')
                          ->orderBy('created_at', 'desc')
                          ->get();

        // Group by status for easier mobile UI
        $groupedBookings = [
            'pending' => $bookings->where('status', 'pending')->values(),
            'approved' => $bookings->where('status', 'approved')->values(),
            'rejected' => $bookings->where('status', 'rejected')->values(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'all_bookings' => $bookings,
                'grouped_bookings' => $groupedBookings,
                'stats' => [
                    'total' => $bookings->count(),
                    'pending' => $groupedBookings['pending']->count(),
                    'approved' => $groupedBookings['approved']->count(),
                    'rejected' => $groupedBookings['rejected']->count(),
                ]
            ],
            'message' => 'Bookings retrieved successfully'
        ]);
    }

    /**
     * Store a new booking.
     */
    public function store(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'time_slot_id' => 'required|exists:time_slots,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'keperluan' => 'required|in:kelas,rapat,lainnya',
            'mata_kuliah' => 'required_if:keperluan,kelas|nullable|string|max:100',
            'dosen' => 'nullable|string|max:100',
            'catatan' => 'required_if:keperluan,lainnya|nullable|string|max:500',
        ]);

        // Check for conflicts
        $existingBooking = Booking::where('room_id', $request->room_id)
            ->where('time_slot_id', $request->time_slot_id)
            ->where('booking_date', $request->booking_date)
            ->where('status', 'approved')
            ->exists();

        if ($existingBooking) {
            return response()->json([
                'success' => false,
                'message' => 'This time slot is no longer available',
                'errors' => ['slot' => ['Time slot conflict']]
            ], 422);
        }

        // Check user duplicate booking
        $userBooking = Booking::where('user_id', auth()->id())
            ->where('time_slot_id', $request->time_slot_id)
            ->where('booking_date', $request->booking_date)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($userBooking) {
            return response()->json([
                'success' => false,
                'message' => 'You already have a booking for this time slot',
                'errors' => ['user' => ['Duplicate booking']]
            ], 422);
        }

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'room_id' => $request->room_id,
            'time_slot_id' => $request->time_slot_id,
            'booking_date' => $request->booking_date,
            'keperluan' => $request->keperluan,
            'mata_kuliah' => $request->mata_kuliah,
            'dosen' => $request->dosen,
            'catatan' => $request->catatan,
            'status' => 'pending',
        ]);

        $booking->load(['room', 'timeSlot']);

        return response()->json([
            'success' => true,
            'data' => $booking,
            'message' => 'Booking request submitted successfully! Please wait for admin approval.'
        ], 201);
    }

    /**
     * Display the specified booking.
     */
    public function show(Booking $booking)
    {
        // Ensure user can only see their own bookings
        if ($booking->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $booking->load(['room', 'timeSlot', 'user']);

        return response()->json([
            'success' => true,
            'data' => $booking,
            'message' => 'Booking retrieved successfully'
        ]);
    }

    /**
     * Update the specified booking (only if pending).
     */
    public function update(Request $request, Booking $booking)
    {
        // Check permissions
        if ($booking->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        if ($booking->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending bookings can be updated'
            ], 422);
        }

        $request->validate([
            'keperluan' => 'required|in:kelas,rapat,lainnya',
            'mata_kuliah' => 'required_if:keperluan,kelas|nullable|string|max:100',
            'dosen' => 'nullable|string|max:100',
            'catatan' => 'required_if:keperluan,lainnya|nullable|string|max:500',
        ]);

        $booking->update([
            'keperluan' => $request->keperluan,
            'mata_kuliah' => $request->mata_kuliah,
            'dosen' => $request->dosen,
            'catatan' => $request->catatan,
        ]);

        $booking->load(['room', 'timeSlot']);

        return response()->json([
            'success' => true,
            'data' => $booking,
            'message' => 'Booking updated successfully'
        ]);
    }

    /**
     * Remove the specified booking (only if pending).
     */
    public function destroy(Booking $booking)
    {
        // Check permissions
        if ($booking->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        if ($booking->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending bookings can be cancelled'
            ], 422);
        }

        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'Booking cancelled successfully'
        ]);
    }

    /**
     * Get booking form data (rooms and time slots).
     */
    public function formData()
    {
        $rooms = Room::active()->orderBy('name')->get();
        $timeSlots = TimeSlot::active()->ordered()->get();

        return response()->json([
            'success' => true,
            'data' => [
                'rooms' => $rooms,
                'time_slots' => $timeSlots,
                'keperluan_options' => [
                    ['value' => 'kelas', 'label' => 'Class (Kelas)'],
                    ['value' => 'rapat', 'label' => 'Meeting (Rapat)'],
                    ['value' => 'lainnya', 'label' => 'Others (Lainnya)'],
                ]
            ],
            'message' => 'Form data retrieved successfully'
        ]);
    }
}