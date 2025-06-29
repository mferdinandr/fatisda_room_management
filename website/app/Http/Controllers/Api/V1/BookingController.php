<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Models\Booking;
use App\Models\Room;
use App\Models\TimeSlot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends BaseController
{
    // ===== USER METHODS =====
    
    /**
     * Check availability for booking
     */
    public function checkAvailability(Request $request): JsonResponse
    {
        try {
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
                return $this->sendError(
                    'Time slot not available',
                    ['error' => 'This time slot is no longer available'],
                    409
                );
            }

            $room = Room::findOrFail($request->room_id);
            $timeSlot = TimeSlot::findOrFail($request->time_slot_id);

            return $this->sendResponse([
                'available' => true,
                'room' => [
                    'id' => $room->id,
                    'name' => $room->name,
                    'capacity' => $room->capacity,
                    'facilities' => $room->facilities,
                ],
                'time_slot' => [
                    'id' => $timeSlot->id,
                    'start_time' => $timeSlot->start_time,
                    'end_time' => $timeSlot->end_time,
                    'label' => $timeSlot->label,
                ],
                'date' => $request->date,
            ], 'Slot is available for booking');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation Error', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Failed to check availability', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new booking (User)
     */
    public function store(Request $request): JsonResponse
    {
        try {
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
                return $this->sendError(
                    'Time slot conflict',
                    ['conflict' => 'This time slot is no longer available'],
                    409
                );
            }

            // Check if user already has a booking for this date and time
            $userBooking = Booking::where('user_id', auth()->id())
                ->where('time_slot_id', $request->time_slot_id)
                ->where('booking_date', $request->booking_date)
                ->whereIn('status', ['pending', 'approved'])
                ->exists();

            if ($userBooking) {
                return $this->sendError(
                    'User booking conflict',
                    ['user_conflict' => 'You already have a booking for this time slot'],
                    409
                );
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
                'color' => $this->generateRandomColor(), // Auto-generate color
            ]);

            // Load relationships
            $booking->load(['room', 'timeSlot', 'user']);

            $bookingData = [
                'id' => $booking->id,
                'booking_date' => $booking->booking_date,
                'keperluan' => $booking->keperluan,
                'mata_kuliah' => $booking->mata_kuliah,
                'dosen' => $booking->dosen,
                'catatan' => $booking->catatan,
                'status' => $booking->status,
                'color' => $booking->color, // Include color in response
                'room' => [
                    'id' => $booking->room->id,
                    'name' => $booking->room->name,
                ],
                'time_slot' => [
                    'id' => $booking->timeSlot->id,
                    'label' => $booking->timeSlot->label,
                ],
                'user' => [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                ],
                'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
            ];

            return $this->sendResponse(
                $bookingData, 
                'Booking request submitted successfully! Please wait for admin approval.',
                201
            );

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation Error', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Failed to create booking', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get user's bookings
     */
    public function myBookings(Request $request): JsonResponse
    {
        try {
            $query = Booking::with(['room', 'timeSlot'])
                ->where('user_id', auth()->id());

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by date range
            if ($request->has('date_from')) {
                $query->where('booking_date', '>=', $request->date_from);
            }
            if ($request->has('date_to')) {
                $query->where('booking_date', '<=', $request->date_to);
            }

            $bookings = $query->orderBy('booking_date', 'desc')
                             ->orderBy('created_at', 'desc')
                             ->get();

            $bookingsData = $bookings->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_date' => $booking->booking_date,
                    'keperluan' => $booking->keperluan,
                    'mata_kuliah' => $booking->mata_kuliah,
                    'dosen' => $booking->dosen,
                    'catatan' => $booking->catatan,
                    'status' => $booking->status,
                    'color' => $booking->color, // Include color
                    'admin_notes' => $booking->admin_notes,
                    'room' => [
                        'id' => $booking->room->id,
                        'name' => $booking->room->name,
                    ],
                    'time_slot' => [
                        'id' => $booking->timeSlot->id,
                        'label' => $booking->timeSlot->label,
                        'start_time' => $booking->timeSlot->start_time,
                        'end_time' => $booking->timeSlot->end_time,
                    ],
                    'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $booking->updated_at->format('Y-m-d H:i:s'),
                ];
            });

            return $this->sendResponse($bookingsData, 'User bookings retrieved successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve bookings', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show single booking (User)
     */
    public function show(Booking $booking): JsonResponse
    {
        try {
            // Check if admin or owner
            if (!auth()->user()->isAdmin() && $booking->user_id !== auth()->id()) {
                return $this->sendError('Unauthorized', ['error' => 'Access denied'], 403);
            }

            $booking->load(['room', 'timeSlot', 'user']);

            $bookingData = [
                'id' => $booking->id,
                'booking_date' => $booking->booking_date,
                'keperluan' => $booking->keperluan,
                'mata_kuliah' => $booking->mata_kuliah,
                'dosen' => $booking->dosen,
                'catatan' => $booking->catatan,
                'status' => $booking->status,
                'color' => $booking->color, // Include color
                'admin_notes' => $booking->admin_notes,
                'room' => [
                    'id' => $booking->room->id,
                    'name' => $booking->room->name,
                    'capacity' => $booking->room->capacity,
                    'facilities' => $booking->room->facilities,
                ],
                'time_slot' => [
                    'id' => $booking->timeSlot->id,
                    'label' => $booking->timeSlot->label,
                    'start_time' => $booking->timeSlot->start_time,
                    'end_time' => $booking->timeSlot->end_time,
                ],
                'user' => [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                    'email' => $booking->user->email,
                ],
                'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $booking->updated_at->format('Y-m-d H:i:s'),
            ];

            return $this->sendResponse($bookingData, 'Booking retrieved successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve booking', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update booking (User - only if pending)
     */
    public function update(Request $request, Booking $booking): JsonResponse
    {
        try {
            // Ensure user can only update their own pending bookings
            if ($booking->user_id !== auth()->id() || $booking->status !== 'pending') {
                return $this->sendError(
                    'Unauthorized', 
                    ['error' => 'Can only update your own pending bookings'], 
                    403
                );
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

            $booking->load(['room', 'timeSlot', 'user']);

            $bookingData = [
                'id' => $booking->id,
                'booking_date' => $booking->booking_date,
                'keperluan' => $booking->keperluan,
                'mata_kuliah' => $booking->mata_kuliah,
                'dosen' => $booking->dosen,
                'catatan' => $booking->catatan,
                'status' => $booking->status,
                'color' => $booking->color, // Include color
                'room' => [
                    'id' => $booking->room->id,
                    'name' => $booking->room->name,
                ],
                'time_slot' => [
                    'id' => $booking->timeSlot->id,
                    'label' => $booking->timeSlot->label,
                ],
                'updated_at' => $booking->updated_at->format('Y-m-d H:i:s'),
            ];

            return $this->sendResponse($bookingData, 'Booking updated successfully');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation Error', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Failed to update booking', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cancel booking (User - only if pending)
     */
    public function destroy(Booking $booking): JsonResponse
    {
        try {
            // Admin can delete any booking, user can only delete own pending
            if (!auth()->user()->isAdmin()) {
                if ($booking->user_id !== auth()->id() || $booking->status !== 'pending') {
                    return $this->sendError(
                        'Unauthorized', 
                        ['error' => 'Can only cancel your own pending bookings'], 
                        403
                    );
                }
            }

            $booking->delete();

            return $this->sendResponse([], 'Booking cancelled successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to cancel booking', ['error' => $e->getMessage()], 500);
        }
    }

    // ===== PUBLIC METHODS =====

    /**
     * Get public schedule/bookings (approved bookings only)
     */
    public function publicSchedule(Request $request): JsonResponse
    {
        try {
            $query = Booking::with(['user', 'room', 'timeSlot'])
                ->where('status', 'approved'); // Only approved bookings

            // Filter by date
            $date = $request->get('date', now()->format('Y-m-d'));
            if ($date) {
                $query->where('booking_date', $date);
            }

            // Filter by date range
            if ($request->filled('date_from')) {
                $query->where('booking_date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->where('booking_date', '<=', $request->date_to);
            }

            // Filter by room
            if ($request->filled('room_id')) {
                $query->where('room_id', $request->room_id);
            }

            // Filter by time slot
            if ($request->filled('time_slot_id')) {
                $query->where('time_slot_id', $request->time_slot_id);
            }

            // Sort by date and time
            $bookings = $query->orderBy('booking_date', 'asc')
                             ->orderBy('created_at', 'asc')
                             ->get();

            $bookingsData = $bookings->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_date' => $booking->booking_date,
                    'keperluan' => $booking->keperluan,
                    'mata_kuliah' => $booking->mata_kuliah,
                    'dosen' => $booking->dosen,
                    'status' => $booking->status,
                    'color' => $booking->color, // Include color for public display
                    'user_name' => $booking->user->name, // Only show name, not full user data
                    'room' => [
                        'id' => $booking->room->id,
                        'name' => $booking->room->name,
                        'capacity' => $booking->room->capacity,
                    ],
                    'time_slot' => [
                        'id' => $booking->timeSlot->id,
                        'label' => $booking->timeSlot->label,
                        'start_time' => $booking->timeSlot->start_time,
                        'end_time' => $booking->timeSlot->end_time,
                    ],
                ];
            });

            // Group by room for better visualization (optional)
            if ($request->boolean('group_by_room')) {
                $groupedData = $bookingsData->groupBy('room.name');
                
                return $this->sendResponse([
                    'date' => $date,
                    'total_bookings' => $bookingsData->count(),
                    'bookings_by_room' => $groupedData,
                ], 'Public schedule retrieved successfully');
            }

            return $this->sendResponse([
                'date' => $date,
                'total_bookings' => $bookingsData->count(),
                'bookings' => $bookingsData,
            ], 'Public schedule retrieved successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve public schedule', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get public schedule matrix (like the main page schedule)
     */
    public function publicScheduleMatrix(Request $request): JsonResponse
    {
        try {
            $date = $request->get('date', now()->format('Y-m-d'));
            
            // Validate date format
            try {
                $selectedDate = \Carbon\Carbon::createFromFormat('Y-m-d', $date);
            } catch (\Exception $e) {
                return $this->sendError('Invalid date format', ['error' => 'Date must be in Y-m-d format'], 422);
            }

            // Get active rooms and time slots
            $rooms = Room::where('is_active', true)->orderBy('name')->get();
            $timeSlots = TimeSlot::where('is_active', true)->orderBy('start_time')->get();
            
            // Get approved bookings for the selected date
            $bookings = Booking::with(['user', 'room', 'timeSlot'])
                ->where('status', 'approved')
                ->where('booking_date', $date)
                ->get();

            // Create schedule matrix
            $schedule = [];
            foreach ($timeSlots as $timeSlot) {
                $row = [
                    'time_slot' => [
                        'id' => $timeSlot->id,
                        'start_time' => $timeSlot->start_time,
                        'end_time' => $timeSlot->end_time,
                        'label' => $timeSlot->label,
                    ],
                    'slots' => []
                ];
                
                foreach ($rooms as $room) {
                    // Find booking for this time slot and room
                    $booking = $bookings->first(function ($booking) use ($room, $timeSlot) {
                        return $booking->room_id === $room->id && 
                               $booking->time_slot_id === $timeSlot->id;
                    });
                    
                    $slotData = [
                        'room_id' => $room->id,
                        'room_name' => $room->name,
                        'time_slot_id' => $timeSlot->id,
                        'is_booked' => $booking !== null,
                        'is_available' => $booking === null && $room->is_active && $timeSlot->is_active,
                    ];

                    // Add booking info if exists
                    if ($booking) {
                        $slotData['booking'] = [
                            'id' => $booking->id,
                            'keperluan' => $booking->keperluan,
                            'mata_kuliah' => $booking->mata_kuliah,
                            'dosen' => $booking->dosen,
                            'color' => $booking->color, // Include color for matrix display
                            'user_name' => $booking->user->name,
                        ];
                    }
                    
                    $row['slots'][] = $slotData;
                }
                
                $schedule[] = $row;
            }

            return $this->sendResponse([
                'date' => $date,
                'selected_date' => $selectedDate->format('l, F j, Y'),
                'rooms' => $rooms->map(function($room) {
                    return [
                        'id' => $room->id,
                        'name' => $room->name,
                        'capacity' => $room->capacity,
                    ];
                }),
                'time_slots' => $timeSlots->map(function($slot) {
                    return [
                        'id' => $slot->id,
                        'start_time' => $slot->start_time,
                        'end_time' => $slot->end_time,
                        'label' => $slot->label,
                    ];
                }),
                'schedule' => $schedule,
                'total_bookings' => $bookings->count(),
            ], 'Public schedule matrix retrieved successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve schedule matrix', ['error' => $e->getMessage()], 500);
        }
    }

    // ===== ADMIN METHODS =====

    /**
     * Get all bookings (Admin only)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Check if user is admin
            if (!auth()->user()->isAdmin()) {
                return $this->sendError('Unauthorized', ['error' => 'Admin access required'], 403);
            }

            $query = Booking::with(['user', 'room', 'timeSlot']);

            // Filter by status
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            // Filter by date range
            if ($request->filled('date_from')) {
                $query->whereDate('booking_date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->whereDate('booking_date', '<=', $request->date_to);
            }

            // Filter by room
            if ($request->filled('room_id')) {
                $query->where('room_id', $request->room_id);
            }

            // Search by user name or course
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    })->orWhere('mata_kuliah', 'like', "%{$search}%")
                      ->orWhere('dosen', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 20);
            $bookings = $query->orderBy('booking_date', 'desc')
                             ->orderBy('created_at', 'desc')
                             ->paginate($perPage);

            // Get stats
            $stats = [
                'total' => Booking::count(),
                'pending' => Booking::where('status', 'pending')->count(),
                'approved' => Booking::where('status', 'approved')->count(),
                'rejected' => Booking::where('status', 'rejected')->count(),
            ];

            $bookingsData = $bookings->getCollection()->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_date' => $booking->booking_date,
                    'keperluan' => $booking->keperluan,
                    'mata_kuliah' => $booking->mata_kuliah,
                    'dosen' => $booking->dosen,
                    'catatan' => $booking->catatan,
                    'status' => $booking->status,
                    'color' => $booking->color, // Include color for admin view
                    'admin_notes' => $booking->admin_notes,
                    'user' => [
                        'id' => $booking->user->id,
                        'name' => $booking->user->name,
                        'email' => $booking->user->email,
                    ],
                    'room' => [
                        'id' => $booking->room->id,
                        'name' => $booking->room->name,
                    ],
                    'time_slot' => [
                        'id' => $booking->timeSlot->id,
                        'label' => $booking->timeSlot->label,
                        'start_time' => $booking->timeSlot->start_time,
                        'end_time' => $booking->timeSlot->end_time,
                    ],
                    'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $booking->updated_at->format('Y-m-d H:i:s'),
                ];
            });

            return $this->sendResponse([
                'bookings' => $bookingsData,
                'pagination' => [
                    'current_page' => $bookings->currentPage(),
                    'last_page' => $bookings->lastPage(),
                    'per_page' => $bookings->perPage(),
                    'total' => $bookings->total(),
                ],
                'stats' => $stats,
            ], 'Bookings retrieved successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to retrieve bookings', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Approve a booking (Admin)
     */
    public function approve(Request $request, Booking $booking): JsonResponse
    {
        try {
            // Check if user is admin
            if (!auth()->user()->isAdmin()) {
                return $this->sendError('Unauthorized', ['error' => 'Admin access required'], 403);
            }

            if ($booking->status !== 'pending') {
                return $this->sendError(
                    'Invalid status',
                    ['error' => 'Only pending bookings can be approved'],
                    400
                );
            }

            // Check for conflicts with already approved bookings
            $conflict = Booking::where('room_id', $booking->room_id)
                ->where('time_slot_id', $booking->time_slot_id)
                ->where('booking_date', $booking->booking_date)
                ->where('status', 'approved')
                ->where('id', '!=', $booking->id)
                ->exists();

            if ($conflict) {
                return $this->sendError(
                    'Booking conflict',
                    ['error' => 'Another booking already approved for this slot'],
                    409
                );
            }

            $booking->update([
                'status' => 'approved',
                'admin_notes' => $request->input('admin_notes'),
            ]);

            return $this->sendResponse([
                'id' => $booking->id,
                'status' => $booking->status,
                'admin_notes' => $booking->admin_notes,
            ], 'Booking approved successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to approve booking', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Reject a booking (Admin)
     */
    public function reject(Request $request, Booking $booking): JsonResponse
    {
        try {
            // Check if user is admin
            if (!auth()->user()->isAdmin()) {
                return $this->sendError('Unauthorized', ['error' => 'Admin access required'], 403);
            }

            $request->validate([
                'admin_notes' => 'required|string|max:500',
            ]);

            if ($booking->status !== 'pending') {
                return $this->sendError(
                    'Invalid status',
                    ['error' => 'Only pending bookings can be rejected'],
                    400
                );
            }

            $booking->update([
                'status' => 'rejected',
                'admin_notes' => $request->admin_notes,
            ]);

            return $this->sendResponse([
                'id' => $booking->id,
                'status' => $booking->status,
                'admin_notes' => $booking->admin_notes,
            ], 'Booking rejected successfully');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation Error', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Failed to reject booking', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Bulk approve bookings (Admin)
     */
    public function bulkApprove(Request $request): JsonResponse
    {
        try {
            // Check if user is admin
            if (!auth()->user()->isAdmin()) {
                return $this->sendError('Unauthorized', ['error' => 'Admin access required'], 403);
            }

            $request->validate([
                'booking_ids' => 'required|array',
                'booking_ids.*' => 'exists:bookings,id',
            ]);

            $bookings = Booking::whereIn('id', $request->booking_ids)
                ->where('status', 'pending')
                ->get();

            $approved = 0;
            $conflicts = 0;

            foreach ($bookings as $booking) {
                // Check for conflicts
                $conflict = Booking::where('room_id', $booking->room_id)
                    ->where('time_slot_id', $booking->time_slot_id)
                    ->where('booking_date', $booking->booking_date)
                    ->where('status', 'approved')
                    ->where('id', '!=', $booking->id)
                    ->exists();

                if (!$conflict) {
                    $booking->update(['status' => 'approved']);
                    $approved++;
                } else {
                    $conflicts++;
                }
            }

            return $this->sendResponse([
                'approved' => $approved,
                'conflicts' => $conflicts,
            ], "Approved {$approved} booking(s). {$conflicts} had conflicts and were skipped.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation Error', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Failed to bulk approve', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Bulk reject bookings (Admin)
     */
    public function bulkReject(Request $request): JsonResponse
    {
        try {
            // Check if user is admin
            if (!auth()->user()->isAdmin()) {
                return $this->sendError('Unauthorized', ['error' => 'Admin access required'], 403);
            }

            $request->validate([
                'booking_ids' => 'required|array',
                'booking_ids.*' => 'exists:bookings,id',
                'admin_notes' => 'required|string|max:500',
            ]);

            $rejected = Booking::whereIn('id', $request->booking_ids)
                ->where('status', 'pending')
                ->update([
                    'status' => 'rejected',
                    'admin_notes' => $request->admin_notes,
                ]);

            return $this->sendResponse([
                'rejected' => $rejected,
            ], "Rejected {$rejected} booking(s) successfully");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendError('Validation Error', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->sendError('Failed to bulk reject', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate random color for booking
     * Same colors as in web controller for consistency
     */
    private function generateRandomColor(): string
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