<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectProperty;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ProjectPropertyController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'key' => [
                'required',
                'string',
                'max:255',
                Rule::unique('project_properties')->where(function ($query) use ($project) {
                    return $query->where('project_id', $project->id);
                })
            ],
            'type' => 'required|string|in:text,select,date,user',
            'icon' => 'required|string',
            'is_visible' => 'boolean',
            'options' => 'nullable|array',
            'order' => 'nullable|integer'
        ]);

        $property = $project->properties()->create([
            'name' => $validated['name'],
            'key' => $validated['key'],
            'type' => $validated['type'],
            'icon' => $validated['icon'],
            'is_visible' => $validated['is_visible'] ?? true,
            'order' => $validated['order'] ?? null,
            'options' => $validated['options'] ?? null
        ]);

        $property->refresh();

        if ($request->wantsJson()) {
            return response()->json([
                'property' => $property,
                'message' => 'Property created successfully'
            ]);
        }

        return redirect()->back()
            ->with('success', 'Property created successfully')
            ->with('newProperty', $property);
    }

    public function update(Request $request, Project $project, ProjectProperty $property)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'key' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('project_properties')->where(function ($query) use ($project, $property) {
                    return $query->where('project_id', $project->id)
                                ->where('id', '!=', $property->id);
                })
            ],
            'type' => 'sometimes|required|string|in:text,select,date,user',
            'icon' => 'sometimes|required|string',
            'is_visible' => 'sometimes|boolean',
            'options' => 'sometimes|nullable|array',
            'order' => 'sometimes|nullable|integer'
        ]);

        $property->update($validated);
        $property->refresh();

        if ($request->wantsJson()) {
            return response()->json([
                'property' => $property,
                'message' => 'Property updated successfully'
            ]);
        }

        return back()
            ->with('success', 'Property updated successfully')
            ->with('newProperty', $property);
    }

    public function reorder(Request $request, Project $project)
    {
        $validated = $request->validate([
            'properties' => 'required|array',
            'properties.*.id' => 'required|exists:project_properties,id',
            'properties.*.order' => 'required|integer',
            'properties.*.is_visible' => 'required|boolean',
        ]);

        foreach ($validated['properties'] as $item) {
            $project->properties()->where('id', $item['id'])->update([
                'order' => $item['order'],
                'is_visible' => $item['is_visible'],
            ]);
        }

        return back()->with('success', 'Properties reordered successfully');
    }

    public function destroy(Project $project, ProjectProperty $property)
    {
        $property->delete();
        return back()->with('success', 'Property deleted successfully');
    }
}
