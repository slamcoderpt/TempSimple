<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectPropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultProperties = [
            [
                'name' => 'Title',
                'key' => 'title',
                'type' => 'text',
                'order' => 1,
                'is_visible' => true,
            ],
            [
                'name' => 'Description',
                'key' => 'description',
                'type' => 'text',
                'order' => 2,
                'is_visible' => true,
            ],
            [
                'name' => 'Status',
                'key' => 'status',
                'type' => 'status',
                'order' => 3,
                'is_visible' => true,
                'options' => [
                    'values' => ['todo', 'in_progress', 'done']
                ]
            ],
            [
                'name' => 'Due Date',
                'key' => 'due_date',
                'type' => 'date',
                'order' => 4,
                'is_visible' => true,
            ],
            [
                'name' => 'Assigned To',
                'key' => 'assigned_to',
                'type' => 'user',
                'order' => 5,
                'is_visible' => true,
            ],
            [
                'name' => 'Priority',
                'key' => 'priority',
                'type' => 'select',
                'order' => 6,
                'is_visible' => true,
                'options' => [
                    'values' => ['low', 'medium', 'high']
                ]
            ],
        ];

        // Add these default properties to all existing projects
        $projects = \App\Models\Project::all();
        foreach ($projects as $project) {
            foreach ($defaultProperties as $property) {
                $project->properties()->create($property);
            }
        }
    }
}
