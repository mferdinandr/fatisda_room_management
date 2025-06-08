<?php

namespace Database\Seeders;

use App\Models\TimeSlot;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
     {
        $timeSlots = [
            ['start_time' => '07:00:00', 'end_time' => '08:00:00', 'label' => '07:00 - 08:00'],
            ['start_time' => '08:00:00', 'end_time' => '09:00:00', 'label' => '08:00 - 09:00'],
            ['start_time' => '09:00:00', 'end_time' => '10:00:00', 'label' => '09:00 - 10:00'],
            ['start_time' => '10:00:00', 'end_time' => '11:00:00', 'label' => '10:00 - 11:00'],
            ['start_time' => '11:00:00', 'end_time' => '12:00:00', 'label' => '11:00 - 12:00'],
            ['start_time' => '12:00:00', 'end_time' => '13:00:00', 'label' => '12:00 - 13:00'],
            ['start_time' => '13:00:00', 'end_time' => '14:00:00', 'label' => '13:00 - 14:00'],
            ['start_time' => '14:00:00', 'end_time' => '15:00:00', 'label' => '14:00 - 15:00'],
            ['start_time' => '15:00:00', 'end_time' => '16:00:00', 'label' => '15:00 - 16:00'],
            ['start_time' => '16:00:00', 'end_time' => '17:00:00', 'label' => '16:00 - 17:00'],
        ];

        foreach ($timeSlots as $timeSlot) {
            TimeSlot::create([
                'start_time' => $timeSlot['start_time'],
                'end_time' => $timeSlot['end_time'],
                'label' => $timeSlot['label'],
                'is_active' => true,
            ]);
        }
    }
}
