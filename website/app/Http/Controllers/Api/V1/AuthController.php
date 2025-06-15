<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Resources\Api\V1\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends BaseController
{
    /**
     * Register a new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user', // Default role adalah user
            ]);

            event(new Registered($user));

            // Create token for the user
            $token = $user->createToken('auth-token')->plainTextToken;

            $data = [
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer'
            ];

            return $this->sendResponse($data, 'User registered successfully', 201);

        } catch (\Exception $e) {
            return $this->sendError('Registration failed', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            // Attempt authentication
            $request->authenticate();

            $user = Auth::user();
            
            // Create token
            $token = $user->createToken('auth-token')->plainTextToken;

            $data = [
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer'
            ];

            return $this->sendResponse($data, 'Login successful');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->sendValidationError(collect($e->errors()));
        } catch (\Exception $e) {
            return $this->sendError('Login failed', ['error' => $e->getMessage()], 401);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            // Revoke current token
            $request->user()->currentAccessToken()->delete();

            return $this->sendResponse([], 'Logout successful');

        } catch (\Exception $e) {
            return $this->sendError('Logout failed', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get authenticated user data
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            return $this->sendResponse(new UserResource($user), 'User data retrieved successfully');

        } catch (\Exception $e) {
            return $this->sendError('Failed to get user data', ['error' => $e->getMessage()], 500);
        }
    }
}