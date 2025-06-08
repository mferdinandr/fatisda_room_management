<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'name' => 'Ruangan 1',
                'capacity' => 30,
                'facilities' => 'Proyektor, AC, Whiteboard',
                'is_active' => true,
            ],
            [
                'name' => 'Ruangan 2', 
                'capacity' => 40,
                'facilities' => 'Proyektor, AC, Whiteboard, Sound System',
                'is_active' => true,
            ],
            [
                'name' => 'Lab Komputer',
                'capacity' => 25,
                'facilities' => 'Komputer, Proyektor, AC',
                'is_active' => true,
            ],
            [
                'name' => 'Aula Besar',
                'capacity' => 100,
                'facilities' => 'Proyektor, Sound System, AC, Panggung',
                'is_active' => true,
            ],
            [
                'name' => 'Ruang Meeting',
                'capacity' => 15,
                'facilities' => 'TV, AC, Meja Bundar',
                'is_active' => true,
            ],
        ];

        foreach ($rooms as $room) {
            Room::create($room);
        }
    }
}
