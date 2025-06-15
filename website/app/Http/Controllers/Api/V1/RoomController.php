<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\V1\RoomStoreRequest;
use App\Http\Requests\Api\V1\RoomUpdateRequest;
use App\Http\Resources\Api\V1\RoomResource;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends BaseController
{
    /**
     * Display a listing of rooms
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Room::query();
            
            // Filter by active status
            if ($request->has('active')) {
                $query->where('is_active', $request->boolean('active'));
            }
            
            // Search by name
            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }
            
            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);
            
            // Pagination
            $perPage = $request->get('per_page', 15);
            $rooms = $query->paginate($perPage);
            
            return $this->sendResponse(
                RoomResource::collection($rooms)->response()->getData(),
                'Rooms retrieved successfully'
            );
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve rooms', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created room
     */
    public function store(RoomStoreRequest $request): JsonResponse
    {
        try {
            $room = Room::create([
                'name' => $request->name,
                'capacity' => $request->capacity,
                'facilities' => $request->facilities,
                'is_active' => $request->boolean('is_active', true),
            ]);

            return $this->sendResponse(
                new RoomResource($room),
                'Room created successfully',
                201
            );
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to create room', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified room
     */
    public function show(Room $room): JsonResponse
    {
        try {
            // Simplified - tanpa load bookings dulu
            $roomData = [
                'id' => $room->id,
                'name' => $room->name,
                'capacity' => $room->capacity,
                'facilities' => $room->facilities,
                'is_active' => $room->is_active,
                'created_at' => $room->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $room->updated_at->format('Y-m-d H:i:s'),
            ];

            return $this->sendResponse($roomData, 'Room retrieved successfully');
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve room', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified room
     */
    public function update(RoomUpdateRequest $request, Room $room): JsonResponse
    {
        try {
            $room->update([
                'name' => $request->name,
                'capacity' => $request->capacity,
                'facilities' => $request->facilities,
                'is_active' => $request->boolean('is_active'),
            ]);

            return $this->sendResponse(
                new RoomResource($room->fresh()),
                'Room updated successfully'
            );
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to update room', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified room
     */
    public function destroy(Room $room): JsonResponse
    {
        try {
            // Check if room has existing bookings
            if ($room->bookings()->count() > 0) {
                return $this->sendError(
                    'Cannot delete room',
                    ['error' => 'Room has existing bookings and cannot be deleted'],
                    409
                );
            }

            $room->delete();

            return $this->sendResponse([], 'Room deleted successfully');
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to delete room', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get room availability
     */
    public function availability(Request $request, Room $room): JsonResponse
    {
        try {
            $date = $request->get('date', now()->format('Y-m-d'));
            
            // Validate date
            try {
                $selectedDate = \Carbon\Carbon::createFromFormat('Y-m-d', $date);
            } catch (\Exception $e) {
                return $this->sendError('Invalid date format', ['error' => 'Date must be in Y-m-d format'], 422);
            }
            
            // Get time slots
            $timeSlots = \App\Models\TimeSlot::active()->ordered()->get();
            
            // Get bookings for this room and date
            $bookings = \App\Models\Booking::where('room_id', $room->id)
                ->forDate($date)
                ->approved()
                ->with('timeSlot')
                ->get()
                ->keyBy('time_slot_id');
            
            $availability = [];
            foreach ($timeSlots as $timeSlot) {
                $isBooked = isset($bookings[$timeSlot->id]);
                $availability[] = [
                    'time_slot_id' => $timeSlot->id,
                    'start_time' => $timeSlot->start_time,
                    'end_time' => $timeSlot->end_time,
                    'is_available' => !$isBooked && $room->is_active && $timeSlot->is_active,
                    'is_booked' => $isBooked,
                    'booking_id' => $isBooked ? $bookings[$timeSlot->id]->id : null,
                ];
            }

            return $this->sendResponse([
                'room' => new RoomResource($room),
                'date' => $date,
                'availability' => $availability
            ], 'Room availability retrieved successfully');
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to get room availability', ['error' => $e->getMessage()], 500);
        }
    }
}