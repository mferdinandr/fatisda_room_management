<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; 

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
      {
        // Buat user admin
        User::create([
            'name' => 'Admin FATISDA',
            'email' => 'admin@fatisda.ac.id',
            'password' => Hash::make('Password123'),
            'role' => 'admin',
        ]);

        // Buat user mahasiswa untuk testing
        User::create([
            'name' => 'John Doe',
            'email' => 'john@student.fatisda.ac.id', 
            'password' => Hash::make('Password123'),
            'role' => 'user',
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@student.fatisda.ac.id',
            'password' => Hash::make('Password123'), 
            'role' => 'user',
        ]);
    }
}
