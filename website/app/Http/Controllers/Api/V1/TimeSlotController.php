<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\TimeSlot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimeSlotController extends BaseController
{
    /**
     * Display a listing of time slots
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = TimeSlot::query();
            
            // Filter by active status
            if ($request->has('active')) {
                $query->where('is_active', $request->boolean('active'));
            }
            
            // Sort by start_time by default
            $sortBy = $request->get('sort_by', 'start_time');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);
            
            $timeSlots = $query->get();
            
            $timeSlotsData = $timeSlots->map(function ($timeSlot) {
                return [
                    'id' => $timeSlot->id,
                    'start_time' => $timeSlot->start_time,
                    'end_time' => $timeSlot->end_time,
                    'label' => $timeSlot->label,
                    'is_active' => $timeSlot->is_active,
                    'created_at' => $timeSlot->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $timeSlot->updated_at->format('Y-m-d H:i:s'),
                ];
            });
            
            return $this->sendResponse($timeSlotsData, 'Time slots retrieved successfully');
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve time slots', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created time slot
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validation
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
                return $this->sendError(
                    'Time conflict',
                    ['time_conflict' => 'Time slot overlaps with existing time slot'],
                    409
                );
            }

            $timeSlot = TimeSlot::create([
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'label' => $label,
                'is_active' => $request->boolean('is_active', true),
            ]);

            $timeSlotData = [
                'id' => $timeSlot->id,
                'start_time' => $timeSlot->start_time,
                'end_time' => $timeSlot->end_time,
                'label' => $timeSlot->label,
                'is_active' => $timeSlot->is_active,
                'created_at' => $timeSlot->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $timeSlot->updated_at->format('Y-m-d H:i:s'),
            ];

            return $this->sendResponse($timeSlotData, 'Time slot created successfully', 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation Error', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Failed to create time slot', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified time slot
     */
    public function show(TimeSlot $timeSlot): JsonResponse
    {
        try {
            $timeSlotData = [
                'id' => $timeSlot->id,
                'start_time' => $timeSlot->start_time,
                'end_time' => $timeSlot->end_time,
                'label' => $timeSlot->label,
                'is_active' => $timeSlot->is_active,
                'created_at' => $timeSlot->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $timeSlot->updated_at->format('Y-m-d H:i:s'),
            ];

            return $this->sendResponse($timeSlotData, 'Time slot retrieved successfully');
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve time slot', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified time slot
     */
    public function update(Request $request, TimeSlot $timeSlot): JsonResponse
    {
        try {
            // Validation
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
                return $this->sendError(
                    'Time conflict',
                    ['time_conflict' => 'Time slot overlaps with existing time slot'],
                    409
                );
            }

            $timeSlot->update([
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'label' => $label,
                'is_active' => $request->boolean('is_active'),
            ]);

            $timeSlotData = [
                'id' => $timeSlot->id,
                'start_time' => $timeSlot->start_time,
                'end_time' => $timeSlot->end_time,
                'label' => $timeSlot->label,
                'is_active' => $timeSlot->is_active,
                'created_at' => $timeSlot->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $timeSlot->updated_at->format('Y-m-d H:i:s'),
            ];

            return $this->sendResponse($timeSlotData, 'Time slot updated successfully');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation Error', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update time slot', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified time slot
     */
    public function destroy(TimeSlot $timeSlot): JsonResponse
    {
        try {
            // Check if time slot has bookings
            if ($timeSlot->bookings()->count() > 0) {
                return $this->sendError(
                    'Cannot delete time slot',
                    ['error' => 'Time slot has existing bookings and cannot be deleted'],
                    409
                );
            }

            $timeSlot->delete();

            return $this->sendResponse([], 'Time slot deleted successfully');
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete time slot', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get available time slots for a specific date
     */
    public function availability(Request $request): JsonResponse
    {
        try {
            $date = $request->get('date', now()->format('Y-m-d'));
            $roomId = $request->get('room_id');
            
            // Validate date
            try {
                $selectedDate = \Carbon\Carbon::createFromFormat('Y-m-d', $date);
            } catch (\Exception $e) {
                return $this->sendError('Invalid date format', ['error' => 'Date must be in Y-m-d format'], 422);
            }
            
            // Get active time slots
            $timeSlots = TimeSlot::where('is_active', true)->orderBy('start_time')->get();
            
            $availability = [];
            
            foreach ($timeSlots as $timeSlot) {
                $query = \App\Models\Booking::where('time_slot_id', $timeSlot->id)
                    ->where('booking_date', $date) // Assuming booking_date column
                    ->where('status', 'approved');
                    
                // Filter by room if specified
                if ($roomId) {
                    $query->where('room_id', $roomId);
                }
                
                $isBooked = $query->exists();
                
                $availability[] = [
                    'id' => $timeSlot->id,
                    'start_time' => $timeSlot->start_time,
                    'end_time' => $timeSlot->end_time,
                    'label' => $timeSlot->label,
                    'is_available' => !$isBooked && $timeSlot->is_active,
                    'is_booked' => $isBooked,
                ];
            }

            return $this->sendResponse([
                'date' => $date,
                'room_id' => $roomId,
                'time_slots' => $availability
            ], 'Time slot availability retrieved successfully');
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to get time slot availability', ['error' => $e->getMessage()], 500);
        }
    }
}