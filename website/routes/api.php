<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test route (sudah working)
Route::get('/working', function () {
    return response()->json(['status' => 'API is working']);
});

// API V1 Routes
Route::prefix('v1')->group(function () {
    
    // Test V1
    Route::get('/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'API V1 is working!',
            'version' => 'v1',
            'timestamp' => now()->format('Y-m-d H:i:s')
        ]);
    });
    
    // Authentication Routes (Public - tidak perlu auth)
    Route::post('/register', function (Request $request) {
        try {
            // Basic validation
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            // Create user
            $user = \App\Models\User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => \Illuminate\Support\Facades\Hash::make($request->password),
                'role' => 'user',
            ]);

            // Create token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer'
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    });
    
    Route::post('/login', function (Request $request) {
        try {
            // Basic validation
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            // Attempt login
            if (!\Illuminate\Support\Facades\Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $user = \Illuminate\Support\Facades\Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer'
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'data' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'data' => ['error' => $e->getMessage()]
            ], 500);
        }
    });
    
    // Protected Routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        
        Route::get('/me', function (Request $request) {
            try {
                $user = $request->user();
                
                return response()->json([
                    'success' => true,
                    'message' => 'User data retrieved successfully',
                    'data' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'is_admin' => $user->role === 'admin',
                        'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                    ]
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to get user data',
                    'data' => ['error' => $e->getMessage()]
                ], 500);
            }
        });
        
        Route::post('/logout', function (Request $request) {
            try {
                $request->user()->currentAccessToken()->delete();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Logout successful',
                    'data' => []
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Logout failed',
                    'data' => ['error' => $e->getMessage()]
                ], 500);
            }
        });
    });

    // Room Management Routes
    Route::get('rooms-public', [App\Http\Controllers\Api\V1\RoomController::class, 'index']);
    Route::get('rooms-public/{room}', [App\Http\Controllers\Api\V1\RoomController::class, 'show']);
    Route::get('rooms-public/{room}/availability', [App\Http\Controllers\Api\V1\RoomController::class, 'availability'])->name('rooms.public.availability');

    Route::middleware('auth:sanctum')->group(function () {
        
        
        // Admin routes for rooms
        Route::middleware('admin')->group(function () {
            Route::get('rooms', [App\Http\Controllers\Api\V1\RoomController::class, 'index']);
            Route::post('rooms', [App\Http\Controllers\Api\V1\RoomController::class, 'store']);
            Route::get('rooms/{room}', [App\Http\Controllers\Api\V1\RoomController::class, 'show']);
            Route::put('rooms/{room}', [App\Http\Controllers\Api\V1\RoomController::class, 'update']);
            Route::delete('rooms/{room}', [App\Http\Controllers\Api\V1\RoomController::class, 'destroy']);
            Route::get('rooms/{room}/availability', [App\Http\Controllers\Api\V1\RoomController::class, 'availability'])->name('rooms.availability');
        });
    });
});

// Routes lama (tetap ada)
Route::get('/schedule', [App\Http\Controllers\ScheduleController::class, 'getSchedule'])->name('api.schedule');
Route::get('/availability', [App\Http\Controllers\ScheduleController::class, 'checkAvailability'])->name('api.availability');