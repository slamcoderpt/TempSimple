<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(TaskProperty::class);
    }

    public function getPropertyValue($propertyId)
    {
        return $this->properties()->where('project_property_id', $propertyId)->value('value');
    }

    public function setPropertyValue($propertyId, $value)
    {
        return $this->properties()->updateOrCreate(
            ['project_property_id' => $propertyId],
            ['value' => $value]
        );
    }
}
