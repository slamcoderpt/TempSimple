<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProjectProperty extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'name',
        'key',
        'type',
        'icon',
        'is_visible',
        'order',
        'options'
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'options' => 'array'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
