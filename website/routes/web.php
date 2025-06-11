<?php

use App\Models\User;
use App\Models\Room;
use App\Models\TimeSlot;
use App\Models\Booking;
use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\TimeSlotController;
use App\Http\Controllers\ScheduleController; 
use App\Http\Controllers\BookingController;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    $date = $request->get('date', now()->format('Y-m-d'));
    
    // Validate date format
    try {
        $selectedDate = \Carbon\Carbon::createFromFormat('Y-m-d', $date);
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
    $schedule = [];
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
        
        $schedule[] = $row;
    }

    return Inertia::render('Home/index', [
        'date' => $date,
        'selectedDate' => $selectedDate->format('l, F j, Y'),
        'rooms' => $rooms,
        'timeSlots' => $timeSlots,
        'bookings' => $bookings,
        'schedule' => $schedule,
        'canGoToPrevious' => $selectedDate->isAfter(now()->startOfDay()),
    ]);
})->name('home');

// Public Schedule Routes 
Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule.index');
Route::get('/api/schedule', [ScheduleController::class, 'getSchedule'])->name('api.schedule');
Route::get('/api/availability', [ScheduleController::class, 'checkAvailability'])->name('api.availability');

// Booking Routes (requires auth) 
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/booking/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/booking', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/my-bookings', [BookingController::class, 'myBookings'])->name('bookings.my-bookings');
    Route::get('/my-bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::get('/my-bookings/{booking}/edit', [BookingController::class, 'edit'])->name('bookings.edit');
    Route::put('/my-bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::delete('/my-bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');
});

// Admin routes 
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/dashboard', function () {
        $stats = [
            'total_rooms' => Room::count(),
            'active_rooms' => Room::where('is_active', true)->count(),
            'total_time_slots' => TimeSlot::count(),
            'total_users' => User::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
        ];
        
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    })->name('dashboard');
    
    // Room Management Routes
    Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index');
    Route::get('/rooms/create', [RoomController::class, 'create'])->name('rooms.create');
    Route::post('/rooms', [RoomController::class, 'store'])->name('rooms.store');
    Route::get('/rooms/{room}', [RoomController::class, 'show'])->name('rooms.show');
    Route::get('/rooms/{room}/edit', [RoomController::class, 'edit'])->name('rooms.edit');
    Route::put('/rooms/{room}', [RoomController::class, 'update'])->name('rooms.update');
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');

     // Time Slot Management Routes - TAMBAH INI
    Route::get('/time-slots', [TimeSlotController::class, 'index'])->name('time-slots.index');
    Route::get('/time-slots/create', [TimeSlotController::class, 'create'])->name('time-slots.create');
    Route::post('/time-slots', [TimeSlotController::class, 'store'])->name('time-slots.store');
    Route::get('/time-slots/{timeSlot}', [TimeSlotController::class, 'show'])->name('time-slots.show');
    Route::get('/time-slots/{timeSlot}/edit', [TimeSlotController::class, 'edit'])->name('time-slots.edit');
    Route::put('/time-slots/{timeSlot}', [TimeSlotController::class, 'update'])->name('time-slots.update');
    Route::delete('/time-slots/{timeSlot}', [TimeSlotController::class, 'destroy'])->name('time-slots.destroy');

    // Booking Management Routes
    Route::get('/bookings', [\App\Http\Controllers\Admin\BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{booking}', [\App\Http\Controllers\Admin\BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{booking}/approve', [\App\Http\Controllers\Admin\BookingController::class, 'approve'])->name('bookings.approve');
    Route::post('/bookings/{booking}/reject', [\App\Http\Controllers\Admin\BookingController::class, 'reject'])->name('bookings.reject');
    Route::post('/bookings/bulk-approve', [\App\Http\Controllers\Admin\BookingController::class, 'bulkApprove'])->name('bookings.bulk-approve');
    Route::post('/bookings/bulk-reject', [\App\Http\Controllers\Admin\BookingController::class, 'bulkReject'])->name('bookings.bulk-reject');
    Route::delete('/bookings/{booking}', [\App\Http\Controllers\Admin\BookingController::class, 'destroy'])->name('bookings.destroy');
    Route::get('/bookings/export', [\App\Http\Controllers\Admin\BookingController::class, 'export'])->name('bookings.export');
});

// User dashboard 
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        // Check if user is admin, redirect accordingly
        if (auth()->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        
        return Inertia::render('Dashboard/index');
    })->name('dashboard');
});

Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    
    return redirect('/');
})->name('logout');

// Test routes (untuk development)
Route::get('/test-db', function () {
    $users = User::all();
    $rooms = Room::all();
    $timeSlots = TimeSlot::all();
    
    return response()->json([
        'users' => $users,
        'rooms' => $rooms, 
        'timeSlots' => $timeSlots
    ]);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';