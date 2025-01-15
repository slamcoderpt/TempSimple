<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TaskController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        try {
            // Create task
            $task = $project->tasks()->create();

            // Get all project properties to map keys to IDs
            $propertyMap = $project->properties->pluck('id', 'key');
            
            // Get properties from the request
            $properties = $request->except(['_token', '_method']);
            
            Log::info('Processing properties', [
                'properties' => $properties,
                'property_map' => $propertyMap
            ]);

            // Save the properties
            foreach ($properties as $key => $value) {
                if ($value !== null && $value !== '' && isset($propertyMap[$key])) {
                    $task->properties()->create([
                        'project_property_id' => $propertyMap[$key],
                        'value' => $value
                    ]);
                }
            }

            // Perform a full page refresh
            return Inertia::location(route('projects.show', $project->id));
        } catch (\Exception $e) {
            Log::error('Task creation failed', [
                'error' => $e->getMessage(),
                'properties' => $properties ?? null
            ]);
            
            return redirect()->back()->withErrors(['error' => 'Failed to create task']);
        }
    }

    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task->project);

        // Handle properties
        $properties = $request->except(['_token', '_method']);

        foreach ($properties as $propertyId => $value) {
            if (is_numeric($propertyId)) {
                $task->setPropertyValue($propertyId, $value);
            }
        }

        return back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $this->authorize('update', $task->project);
        
        $task->delete();

        return back()->with('success', 'Task deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'tasks' => ['required', 'array'],
            'tasks.*' => ['required', 'integer', 'exists:tasks,id']
        ]);

        // Get all tasks
        $tasks = Task::whereIn('id', $request->tasks)->get();
        
        // Get unique project IDs and check authorization for each project
        $projectIds = $tasks->pluck('project_id')->unique();
        foreach ($projectIds as $projectId) {
            $project = Project::findOrFail($projectId);
            $this->authorize('update', $project);
        }

        // Delete all tasks
        Task::whereIn('id', $request->tasks)->delete();

        return redirect()->back()->with('success', 'Tasks deleted successfully.');
    }

    public function bulkDuplicate(Request $request)
    {
        $request->validate([
            'tasks' => ['required', 'array'],
            'tasks.*' => ['required', 'integer', 'exists:tasks,id']
        ]);

        // Get all tasks
        $tasks = Task::whereIn('id', $request->tasks)->get();
        
        // Get unique project IDs and check authorization for each project
        $projectIds = $tasks->pluck('project_id')->unique();
        foreach ($projectIds as $projectId) {
            $project = Project::findOrFail($projectId);
            $this->authorize('update', $project);
        }

        // Duplicate each task
        foreach ($tasks as $task) {
            $newTask = $task->project->tasks()->create();
            
            // Copy all properties
            foreach ($task->properties as $property) {
                $newTask->properties()->create([
                    'project_property_id' => $property->project_property_id,
                    'value' => $property->value
                ]);
            }
        }

        return redirect()->back()->with('success', 'Tasks duplicated successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'tasks' => ['required', 'array'],
            'tasks.*.id' => ['required', 'integer', 'exists:tasks,id'],
            'tasks.*.position' => ['required', 'numeric']
        ]);

        // Get all tasks and check authorization
        $tasks = Task::whereIn('id', collect($request->tasks)->pluck('id'))->get();
        $projectIds = $tasks->pluck('project_id')->unique();
        foreach ($projectIds as $projectId) {
            $project = Project::findOrFail($projectId);
            $this->authorize('update', $project);
        }

        // Update position
        DB::transaction(function () use ($request) {
            foreach ($request->tasks as $taskData) {
                Task::where('id', $taskData['id'])
                    ->update(['position' => $taskData['position']]);
            }
        });

        return redirect()->back()->with('success', 'Tasks reordered successfully');
    }
}
