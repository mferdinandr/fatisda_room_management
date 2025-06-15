<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class RoomStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only admin can create rooms
        return auth()->user() && auth()->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100|unique:rooms,name',
            'capacity' => 'required|integer|min:1|max:1000',
            'facilities' => 'nullable|string|max:500',
            'is_active' => 'boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Room name is required',
            'name.unique' => 'Room name already exists',
            'name.max' => 'Room name cannot exceed 100 characters',
            'capacity.required' => 'Room capacity is required',
            'capacity.integer' => 'Capacity must be a number',
            'capacity.min' => 'Capacity must be at least 1',
            'capacity.max' => 'Capacity cannot exceed 1000',
            'facilities.max' => 'Facilities description cannot exceed 500 characters',
            'is_active.boolean' => 'Active status must be true or false'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation Error',
            'data' => $validator->errors()
        ], 422));
    }

    protected function failedAuthorization()
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Unauthorized. Admin access required.',
            'data' => []
        ], 403));
    }
}