<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['assigned_to']);
            
            // Remove essential columns
            $table->dropColumn([
                'title',
                'description',
                'assigned_to',
                'priority',
                'status',
                'due_date'
            ]);
        });
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Recreate essential columns
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['todo', 'in_progress', 'review', 'completed'])->default('todo');
            $table->date('due_date')->nullable();
        });
    }
}; 