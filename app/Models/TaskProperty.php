<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskProperty extends Model
{
    protected $fillable = [
        'task_id',
        'project_property_id',
        'value'
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(ProjectProperty::class, 'project_property_id');
    }
} 