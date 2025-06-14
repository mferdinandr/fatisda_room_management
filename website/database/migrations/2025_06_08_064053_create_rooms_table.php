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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100); // Nama ruangan seperti "Ruangan 1", "Lab Komputer"
            $table->integer('capacity')->nullable(); // Kapasitas ruangan
            $table->text('facilities')->nullable(); // Fasilitas seperti "Proyektor, AC, Whiteboard"
            $table->boolean('is_active')->default(true); // Apakah ruangan aktif/tidak
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
