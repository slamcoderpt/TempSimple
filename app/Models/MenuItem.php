<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItem extends Model
{
    protected $fillable = [
        'title',
        'type',
        'url',
        'route_name',
        'icon',
        'permissions',
        'parent_id',
        'order',
        'is_active',
        'dynamic_items_query',
    ];

    protected $casts = [
        'permissions' => 'array',
        'dynamic_items_query' => 'array',
        'is_active' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('order');
    }

    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }

    public function getDynamicItems(): array
    {
        if ($this->type !== 'dynamic' || !$this->dynamic_items_query) {
            return [];
        }

        // Example: Get all active projects
        if ($this->dynamic_items_query['type'] === 'projects') {
            return Project::where('status', 'active')
                ->latest()
                ->limit($this->dynamic_items_query['limit'] ?? 10)
                ->get()
                ->map(function ($project) {
                    return [
                        'title' => $project->name,
                        'url' => route('projects.show', $project),
                        'icon' => $project->icon,
                    ];
                })
                ->toArray();
        }

        return [];
    }

    public function hasPermission(User $user): bool
    {
        if (!$this->permissions) {
            return true;
        }

        // Implement permission checking logic here
        return true;
    }
}
