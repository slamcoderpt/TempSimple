<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->decimal('position', 65, 30)->default(0);
        });

        // Initialize positions for existing tasks using MySQL-compatible syntax
        $tasks = DB::table('tasks')
            ->select('id', 'project_id', 'created_at')
            ->orderBy('project_id')
            ->orderBy('created_at')
            ->get();

        $position = 0;
        $currentProjectId = null;

        foreach ($tasks as $task) {
            if ($currentProjectId !== $task->project_id) {
                $position = 0;
                $currentProjectId = $task->project_id;
            }
            $position += 1000; // Use larger intervals initially
            DB::table('tasks')
                ->where('id', $task->id)
                ->update(['position' => $position]);
        }
    }

    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('position');
        });
    }
}; 