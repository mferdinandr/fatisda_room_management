<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Show booking form
     */
    public function create(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'time_slot_id' => 'required|exists:time_slots,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        // Check if slot is still available
        $existingBooking = Booking::where('room_id', $request->room_id)
            ->where('time_slot_id', $request->time_slot_id)
            ->where('booking_date', $request->date)
            ->where('status', 'approved')
            ->exists();

        if ($existingBooking) {
            return redirect()->route('schedule.index', ['date' => $request->date])
                ->with('error', 'This time slot is no longer available.');
        }

        $room = Room::findOrFail($request->room_id);
        $timeSlot = TimeSlot::findOrFail($request->time_slot_id);

        return Inertia::render('Booking/Create', [
            'room' => $room,
            'timeSlot' => $timeSlot,
            'date' => $request->date,
        ]);
    }

    /**
     * Store a new booking
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

        // Double-check availability
        $existingBooking = Booking::where('room_id', $request->room_id)
            ->where('time_slot_id', $request->time_slot_id)
            ->where('booking_date', $request->booking_date)
            ->where('status', 'approved')
            ->exists();

        if ($existingBooking) {
            return redirect()->back()
                ->withErrors(['conflict' => 'This time slot is no longer available.'])
                ->withInput();
        }

        // Check if user already has a booking for this date and time
        $userBooking = Booking::where('user_id', auth()->id())
            ->where('time_slot_id', $request->time_slot_id)
            ->where('booking_date', $request->booking_date)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($userBooking) {
            return redirect()->back()
                ->withErrors(['user_conflict' => 'You already have a booking for this time slot.'])
                ->withInput();
        }

        Booking::create([
            'user_id' => auth()->id(),
            'room_id' => $request->room_id,
            'time_slot_id' => $request->time_slot_id,
            'booking_date' => $request->booking_date,
            'keperluan' => $request->keperluan,
            'mata_kuliah' => $request->mata_kuliah,
            'dosen' => $request->dosen,
            'catatan' => $request->catatan,
            'status' => 'pending',
            'color' => $this->generateRandomColor(),
        ]);

        return redirect()->route('bookings.my-bookings')
            ->with('success', 'Booking request submitted successfully! Please wait for admin approval.');
    }

    /**
     * Show user's bookings
     */
    public function myBookings()
    {
        $bookings = Booking::with(['room', 'timeSlot'])
            ->where('user_id', auth()->id())
            ->orderBy('booking_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Booking/MyBookings', [
            'bookings' => $bookings
        ]);
    }

    /**
     * Show single booking
     */
    public function show(Booking $booking)
    {
        // Ensure user can only see their own bookings
        if ($booking->user_id !== auth()->id()) {
            abort(404);
        }

        $booking->load(['room', 'timeSlot', 'user']);

        return Inertia::render('Booking/Show', [
            'booking' => $booking
        ]);
    }

    /**
     * Edit booking (only if pending)
     */
    public function edit(Booking $booking)
    {
        // Ensure user can only edit their own pending bookings
        if ($booking->user_id !== auth()->id() || $booking->status !== 'pending') {
            abort(404);
        }

        $booking->load(['room', 'timeSlot']);

        return Inertia::render('Booking/Edit', [
            'booking' => $booking
        ]);
    }

    /**
     * Update booking
     */
    public function update(Request $request, Booking $booking)
    {
        // Ensure user can only update their own pending bookings
        if ($booking->user_id !== auth()->id() || $booking->status !== 'pending') {
            abort(404);
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

        return redirect()->route('bookings.my-bookings')
            ->with('success', 'Booking updated successfully!');
    }

    /**
     * Cancel booking (only if pending)
     */
    public function destroy(Booking $booking)
    {
        // Ensure user can only cancel their own pending bookings
        if ($booking->user_id !== auth()->id() || $booking->status !== 'pending') {
            abort(404);
        }

        $booking->delete();

        return redirect()->route('bookings.my-bookings')
            ->with('success', 'Booking cancelled successfully!');
    }

    private function generateRandomColor()
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
            '#EC4899', // Pink
            '#6366F1', // Indigo
        ];
        
        return $colors[array_rand($colors)];
    }
}

