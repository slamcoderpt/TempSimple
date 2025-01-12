<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectFieldType extends Model
{
    protected $fillable = ['name', 'settings'];

    protected $casts = [
        'settings' => 'array',
    ];

    public function fields()
    {
        return $this->hasMany(ProjectField::class, 'field_type_id');
    }
}
