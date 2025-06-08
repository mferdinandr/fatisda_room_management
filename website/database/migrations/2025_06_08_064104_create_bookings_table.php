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
    { Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            
            // Foreign Keys - hubungan ke tabel lain
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->foreignId('time_slot_id')->constrained('time_slots')->onDelete('cascade');
            
            // Data booking
            $table->date('booking_date'); // Tanggal booking
            $table->enum('keperluan', ['kelas', 'rapat', 'lainnya']); // Jenis keperluan
            $table->string('mata_kuliah', 100)->nullable(); // Wajib jika keperluan = kelas
            $table->string('dosen', 100)->nullable(); // Nama dosen
            $table->text('catatan')->nullable(); // Wajib jika keperluan = lainnya
            
            // Status dan approval
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable(); // Catatan dari admin saat reject
            
            $table->timestamps();
            
            // Index untuk performance
            $table->index(['booking_date', 'status']);
            $table->index(['room_id', 'time_slot_id', 'booking_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
