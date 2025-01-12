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
        'show_in_form',
        'order',
        'options'
    ];

    protected $casts = [
        'show_in_form' => 'boolean',
        'is_visible' => 'boolean',
        'options' => 'array'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
