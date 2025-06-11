<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeSlotController extends Controller
{
    /**
     * Display a listing of time slots.
     */
    public function index()
    {
        $timeSlots = TimeSlot::orderBy('start_time')->get();
        
        return Inertia::render('Admin/TimeSlots/Index', [
            'timeSlots' => $timeSlots
        ]);
    }

    /**
     * Show the form for creating a new time slot.
     */
    public function create()
    {
        return Inertia::render('Admin/TimeSlots/Create');
    }

    /**
     * Store a newly created time slot in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_active' => 'boolean'
        ]);

        // Auto-generate label
        $label = $request->start_time . ' - ' . $request->end_time;

        // Check for overlapping time slots
        $overlapping = TimeSlot::where(function ($query) use ($request) {
            $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                  ->orWhere(function ($subQuery) use ($request) {
                      $subQuery->where('start_time', '<=', $request->start_time)
                               ->where('end_time', '>=', $request->end_time);
                  });
        })->exists();

        if ($overlapping) {
            return redirect()->back()
                ->withErrors(['time_conflict' => 'Time slot overlaps with existing time slot.'])
                ->withInput();
        }

        TimeSlot::create([
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'label' => $label,
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.time-slots.index')
            ->with('success', 'Time slot created successfully!');
    }

    /**
     * Display the specified time slot.
     */
    public function show(TimeSlot $timeSlot)
    {
        // Load bookings count for this time slot
        $timeSlot->load('bookings');
        
        return Inertia::render('Admin/TimeSlots/Show', [
            'timeSlot' => $timeSlot,
            'bookingsCount' => $timeSlot->bookings->count()
        ]);
    }

    /**
     * Show the form for editing the specified time slot.
     */
    public function edit(TimeSlot $timeSlot)
    {
        return Inertia::render('Admin/TimeSlots/Edit', [
            'timeSlot' => $timeSlot
        ]);
    }

    /**
     * Update the specified time slot in storage.
     */
    public function update(Request $request, TimeSlot $timeSlot)
    {
        $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_active' => 'boolean'
        ]);

        // Auto-generate label
        $label = $request->start_time . ' - ' . $request->end_time;

        // Check for overlapping time slots (exclude current one)
        $overlapping = TimeSlot::where('id', '!=', $timeSlot->id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                      ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                      ->orWhere(function ($subQuery) use ($request) {
                          $subQuery->where('start_time', '<=', $request->start_time)
                                   ->where('end_time', '>=', $request->end_time);
                      });
            })->exists();

        if ($overlapping) {
            return redirect()->back()
                ->withErrors(['time_conflict' => 'Time slot overlaps with existing time slot.'])
                ->withInput();
        }

        $timeSlot->update([
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'label' => $label,
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.time-slots.index')
            ->with('success', 'Time slot updated successfully!');
    }

    /**
     * Remove the specified time slot from storage.
     */
    public function destroy(TimeSlot $timeSlot)
    {
        // Check if time slot has bookings
        if ($timeSlot->bookings()->count() > 0) {
            return redirect()->route('admin.time-slots.index')
                ->with('error', 'Cannot delete time slot. There are existing bookings.');
        }

        $timeSlot->delete();

        return redirect()->route('admin.time-slots.index')
            ->with('success', 'Time slot deleted successfully!');
    }
}