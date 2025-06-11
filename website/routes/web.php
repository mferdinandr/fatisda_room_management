<?php

use App\Models\User;
use App\Models\Room;
use App\Models\TimeSlot;
use App\Models\Booking;
use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\TimeSlotController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home/index');
})->name('home');

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