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
        Schema::create('project_properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('key')->index();
            $table->string('type')->default('text'); // text, number, date, status, user, etc.
            $table->boolean('is_visible')->default(true);
            $table->integer('order')->default(0);
            $table->json('options')->nullable(); // For storing additional options like status colors, allowed values, etc.
            $table->timestamps();
            
            // Ensure property keys are unique per project
            $table->unique(['project_id', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_properties');
    }
};
