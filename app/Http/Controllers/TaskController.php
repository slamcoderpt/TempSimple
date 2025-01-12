<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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

            return redirect()->back()->with('success', 'Task created successfully');
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
}
