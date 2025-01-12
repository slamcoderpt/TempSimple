<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectProperty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectPropertyController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'key' => 'required|string|max:255',
            'type' => 'required|string|in:text,select,date,user',
            'icon' => 'required|string|max:10',
            'is_visible' => 'boolean',
            'show_in_form' => 'boolean',
            'options' => 'array',
            'options.values' => 'array|required_if:type,select',
            'options.isMultiple' => 'boolean',
            'options.notifyOnChange' => 'boolean',
            'options.includeTime' => 'boolean',
            'options.allowRange' => 'boolean',
            'options.defaultToToday' => 'boolean',
        ]);

        // Get the last order number and increment it
        $lastOrder = $project->properties()->max('order') ?? 0;

        $property = $project->properties()->create([
            'name' => $validated['name'],
            'key' => $validated['key'],
            'type' => $validated['type'],
            'icon' => $validated['icon'],
            'is_visible' => $validated['is_visible'] ?? true,
            'show_in_form' => $validated['show_in_form'] ?? false,
            'order' => $lastOrder + 1,
            'options' => [
                'values' => $validated['options']['values'] ?? [],
                'isMultiple' => $validated['options']['isMultiple'] ?? false,
                'notifyOnChange' => $validated['options']['notifyOnChange'] ?? false,
                'includeTime' => $validated['options']['includeTime'] ?? false,
                'allowRange' => $validated['options']['allowRange'] ?? false,
                'defaultToToday' => $validated['options']['defaultToToday'] ?? false,
            ],
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
            'name' => 'sometimes|string|max:255',
            'key' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:text,select,date,user',  // This matches the frontend options
            'icon' => 'required|string|max:10',
            'is_visible' => 'sometimes|boolean',
            'show_in_form' => 'sometimes|boolean',
            'options' => 'sometimes|array',
            'options.values' => 'array|required_if:type,select',
            'options.isMultiple' => 'boolean',
            'options.notifyOnChange' => 'boolean',
            'options.includeTime' => 'boolean',
            'options.allowRange' => 'boolean',
            'options.defaultToToday' => 'boolean',
        ]);

        // If updating options, ensure boolean values are properly cast
        if (isset($validated['options'])) {
            $validated['options'] = array_merge($property->options ?? [], $validated['options']);
            
            // Explicitly cast boolean options
            $booleanOptions = ['isMultiple', 'notifyOnChange', 'includeTime', 'allowRange', 'defaultToToday'];
            foreach ($booleanOptions as $option) {
                if (isset($validated['options'][$option])) {
                    $validated['options'][$option] = (bool) $validated['options'][$option];
                }
            }
        }

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
