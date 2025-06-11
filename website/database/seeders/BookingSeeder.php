<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Room;
use App\Models\TimeSlot;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users
        $john = User::where('email', 'john@student.fatisda.ac.id')->first();
        $jane = User::where('email', 'jane@student.fatisda.ac.id')->first();

        // Get rooms
        $room1 = Room::where('name', 'Ruangan 1')->first();
        $room2 = Room::where('name', 'Ruangan 2')->first();
        $room3 = Room::where('name', 'Lab Komputer')->first();
        $room4 = Room::where('name', 'Aula Besar')->first();

        // Get time slots
        $slot9 = TimeSlot::where('start_time', '09:00:00')->first();
        $slot10 = TimeSlot::where('start_time', '10:00:00')->first();
        $slot15 = TimeSlot::where('start_time', '15:00:00')->first();
        $slot16 = TimeSlot::where('start_time', '16:00:00')->first();

        if (!$john || !$jane || !$room1 || !$room2 || !$slot9 || !$slot10) {
            return; // Skip if data not found
        }

        // Create sample bookings for today and tomorrow
        $today = Carbon::now()->format('Y-m-d');
        $tomorrow = Carbon::now()->addDay()->format('Y-m-d');

        // Today's bookings
        Booking::create([
            'user_id' => $john->id,
            'room_id' => $room1->id,
            'time_slot_id' => $slot9->id,
            'booking_date' => $today,
            'keperluan' => 'kelas',
            'mata_kuliah' => 'Kalkulus 2',
            'dosen' => 'Dr. John Smith',
            'status' => 'approved',
        ]);

        if ($room2 && $slot10) {
            Booking::create([
                'user_id' => $jane->id,
                'room_id' => $room2->id,
                'time_slot_id' => $slot10->id,
                'booking_date' => $today,
                'keperluan' => 'kelas',
                'mata_kuliah' => 'Kalkulus 2',
                'dosen' => 'Dr. Jane Doe',
                'status' => 'approved',
            ]);
        }

        // Add more bookings for variety
        if ($room3 && $slot15) {
            Booking::create([
                'user_id' => $john->id,
                'room_id' => $room3->id,
                'time_slot_id' => $slot15->id,
                'booking_date' => $today,
                'keperluan' => 'rapat',
                'dosen' => 'Koordinator Program',
                'status' => 'approved',
            ]);
        }

        if ($room4 && $slot15 && $slot16) {
            // Multi-slot booking (15:00-17:00)
            Booking::create([
                'user_id' => $jane->id,
                'room_id' => $room4->id,
                'time_slot_id' => $slot15->id,
                'booking_date' => $today,
                'keperluan' => 'kelas',
                'mata_kuliah' => 'Kalkulus 12',
                'dosen' => 'Prof. Wilson',
                'status' => 'approved',
            ]);

            Booking::create([
                'user_id' => $jane->id,
                'room_id' => $room4->id,
                'time_slot_id' => $slot16->id,
                'booking_date' => $today,
                'keperluan' => 'kelas',
                'mata_kuliah' => 'Kalkulus 12',
                'dosen' => 'Prof. Wilson',
                'status' => 'approved',
            ]);
        }

        // Tomorrow's bookings
        if ($room1 && $slot10) {
            Booking::create([
                'user_id' => $john->id,
                'room_id' => $room1->id,
                'time_slot_id' => $slot10->id,
                'booking_date' => $tomorrow,
                'keperluan' => 'kelas',
                'mata_kuliah' => 'Algoritma Pemrograman',
                'dosen' => 'Dr. Alice Brown',
                'status' => 'approved',
            ]);
        }

        // Pending booking for demo
        if ($room2 && $slot15) {
            Booking::create([
                'user_id' => $jane->id,
                'room_id' => $room2->id,
                'time_slot_id' => $slot15->id,
                'booking_date' => $tomorrow,
                'keperluan' => 'lainnya',
                'catatan' => 'Seminar mahasiswa tingkat akhir',
                'dosen' => 'Dr. Sarah Johnson',
                'status' => 'pending',
            ]);
        }
    }
}