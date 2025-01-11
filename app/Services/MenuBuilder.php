<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Support\Collection;

class MenuBuilder
{
    public function getMenu(User $user): array
    {
        return MenuItem::whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('order')
            ->with('allChildren')
            ->get()
            ->filter(function ($item) use ($user) {
                return $item->hasPermission($user);
            })
            ->map(function ($item) use ($user) {
                return $this->processMenuItem($item, $user);
            })
            ->filter(fn ($item) => !empty($item))
            ->values()
            ->toArray();
    }

    protected function processMenuItem(MenuItem $item, User $user): array
    {
        // Skip items that are not ready (no URL/route for fixed items)
        if ($item->type === 'fixed' && !$item->url && !$item->route_name) {
            return [];
        }

        $menuItem = [
            'id' => $item->id,
            'title' => $item->title,
            'type' => $item->type,
            'icon' => $item->icon,
        ];

        // Set URL based on type
        if ($item->type === 'fixed') {
            $menuItem['url'] = $item->url;
            $menuItem['route_name'] = $item->route_name;
        }

        // Process children
        $children = collect();

        // Add static children
        if ($item->children) {
            $children = $item->children
                ->filter(fn ($child) => $child->is_active && $child->hasPermission($user))
                ->map(fn ($child) => $this->processMenuItem($child, $user))
                ->filter(fn ($child) => !empty($child)); // Remove empty items
        }

        // Add dynamic items if any
        if ($item->type === 'dynamic') {
            // Only add dynamic items if they have a valid query
            if ($item->dynamic_items_query && isset($item->dynamic_items_query['type'])) {
                $dynamicItems = collect($item->getDynamicItems())
                    ->map(function ($dynamicItem) {
                        return [
                            'title' => $dynamicItem['title'],
                            'url' => $dynamicItem['url'],
                            'icon' => $dynamicItem['icon'],
                            'type' => 'dynamic_item',
                        ];
                    });

                $children = $children->merge($dynamicItems);
            }
        }

        // For dropdown type, only return if it has children
        if ($item->type === 'dropdown' && $children->isEmpty()) {
            return [];
        }

        if ($children->isNotEmpty()) {
            $menuItem['children'] = $children->values()->toArray();
        }

        return $menuItem;
    }

    public function createMenuItem(array $data): MenuItem
    {
        return MenuItem::create($data);
    }

    public function updateMenuItem(MenuItem $item, array $data): bool
    {
        return $item->update($data);
    }

    public function deleteMenuItem(MenuItem $item): bool
    {
        return $item->delete();
    }

    public function reorderMenuItems(array $items): void
    {
        foreach ($items as $order => $id) {
            MenuItem::where('id', $id)->update(['order' => $order]);
        }
    }
} 