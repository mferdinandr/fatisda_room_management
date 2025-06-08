<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('time_slots', function (Blueprint $table) {
            $table->id();
            $table->time('start_time'); // Jam mulai seperti "09:00:00"
            $table->time('end_time');   // Jam selesai seperti "10:00:00"
            $table->string('label', 50); // Label untuk ditampilkan seperti "09:00 - 10:00"
            $table->boolean('is_active')->default(true); // Apakah time slot aktif
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_slots');
    }
};
