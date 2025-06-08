<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of rooms.
     */
    public function index()
    {
        $rooms = Room::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => $rooms
        ]);
    }

    /**
     * Show the form for creating a new room.
     */
    public function create()
    {
        return Inertia::render('Admin/Rooms/Create');
    }

    /**
     * Store a newly created room in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:rooms,name',
            'capacity' => 'required|integer|min:1|max:1000',
            'facilities' => 'nullable|string|max:500',
            'is_active' => 'boolean'
        ]);

        Room::create([
            'name' => $request->name,
            'capacity' => $request->capacity,
            'facilities' => $request->facilities,
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.rooms.index')
            ->with('success', 'Room created successfully!');
    }

    /**
     * Display the specified room.
     */
    public function show(Room $room)
    {
        // Load bookings count for this room
        $room->load('bookings');
        
        return Inertia::render('Admin/Rooms/Show', [
            'room' => $room,
            'bookingsCount' => $room->bookings->count()
        ]);
    }

    /**
     * Show the form for editing the specified room.
     */
    public function edit(Room $room)
    {
        return Inertia::render('Admin/Rooms/Edit', [
            'room' => $room
        ]);
    }

    /**
     * Update the specified room in storage.
     */
    public function update(Request $request, Room $room)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:rooms,name,' . $room->id,
            'capacity' => 'required|integer|min:1|max:1000',
            'facilities' => 'nullable|string|max:500',
            'is_active' => 'boolean'
        ]);

        $room->update([
            'name' => $request->name,
            'capacity' => $request->capacity,
            'facilities' => $request->facilities,
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.rooms.index')
            ->with('success', 'Room updated successfully!');
    }

    /**
     * Remove the specified room from storage.
     */
    public function destroy(Room $room)
    {
        // Cek apakah room punya booking
        if ($room->bookings()->count() > 0) {
            return redirect()->route('admin.rooms.index')
                ->with('error', 'Cannot delete room. There are existing bookings.');
        }

        $room->delete();

        return redirect()->route('admin.rooms.index')
            ->with('success', 'Room deleted successfully!');
    }
}