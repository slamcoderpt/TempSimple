<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Services\MenuBuilder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    protected $menuBuilder;

    public function __construct(MenuBuilder $menuBuilder)
    {
        $this->menuBuilder = $menuBuilder;
    }

    public function index()
    {
        $menuItems = MenuItem::whereNull('parent_id')
            ->with('allChildren')
            ->orderBy('order')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'type' => $item->type,
                    'url' => $item->url,
                    'route_name' => $item->route_name,
                    'icon' => $item->icon,
                    'is_active' => $item->is_active,
                    'dynamic_items_query' => $item->dynamic_items_query,
                    'children' => $item->allChildren->map(function ($child) {
                        return [
                            'id' => $child->id,
                            'title' => $child->title,
                            'type' => $child->type,
                            'url' => $child->url,
                            'route_name' => $child->route_name,
                            'icon' => $child->icon,
                            'is_active' => $child->is_active,
                            'dynamic_items_query' => $child->dynamic_items_query,
                        ];
                    })->toArray(),
                ];
            })
            ->toArray();

        return Inertia::render('MenuBuilder/Index', [
            'menuItems' => $menuItems,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:fixed,dynamic,dropdown',
            'url' => 'nullable|string|max:255',
            'route_name' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'dynamic_items_query' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $this->menuBuilder->createMenuItem($validated);

        return redirect()->back()->with('success', 'Menu item created successfully.');
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:fixed,dynamic,dropdown',
            'url' => 'nullable|string|max:255',
            'route_name' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'permissions' => 'nullable|array',
            'dynamic_items_query' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $this->menuBuilder->updateMenuItem($menuItem, $validated);

        return redirect()->back()->with('success', 'Menu item updated successfully.');
    }

    public function destroy(MenuItem $menuItem)
    {
        $this->menuBuilder->deleteMenuItem($menuItem);

        return redirect()->back()->with('success', 'Menu item deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'menuItemId' => 'required|exists:menu_items,id',
            'newParentId' => 'nullable|exists:menu_items,id',
            'newOrder' => 'required|integer|min:0',
        ]);

        $menuItem = MenuItem::findOrFail($validated['menuItemId']);
        
        // Update parent
        $menuItem->parent_id = $validated['newParentId'];
        $menuItem->save();

        // Get siblings for reordering
        $siblings = MenuItem::where('parent_id', $validated['newParentId'])
            ->where('id', '!=', $menuItem->id)
            ->orderBy('order')
            ->get();

        // Build new order array
        $newOrder = [];
        $currentIndex = 0;

        foreach ($siblings as $sibling) {
            if ($currentIndex == $validated['newOrder']) {
                $newOrder[] = $menuItem->id;
            }
            $newOrder[] = $sibling->id;
            $currentIndex++;
        }

        // If the new position is at the end
        if ($currentIndex <= $validated['newOrder']) {
            $newOrder[] = $menuItem->id;
        }

        // Update order for all affected items
        $this->menuBuilder->reorderMenuItems($newOrder);

        return redirect()->back();
    }
} 