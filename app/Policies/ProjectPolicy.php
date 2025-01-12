<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): bool
    {
        // User can view if they are the owner or a member of the project
        return $user->id === $project->user_id || 
               $project->members()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        // Project owner or admin member can update
        return $user->id === $project->user_id || 
               $project->users()
                      ->where('user_id', $user->id)
                      ->where('role', 'admin')
                      ->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can manage members in the project.
     */
    public function manageMembers(User $user, Project $project): bool
    {
        // Project owner or admin member can manage members
        return $user->id === $project->user_id || 
               $project->users()
                      ->where('user_id', $user->id)
                      ->where('role', 'admin')
                      ->exists();
    }

    /**
     * Determine whether the user can view all tasks in the project.
     */
    public function viewAllTasks(User $user, Project $project): bool
    {
        // Project owner or admin member can view all tasks
        return $user->id === $project->user_id || 
               $project->users()
                      ->where('user_id', $user->id)
                      ->where('role', 'admin')
                      ->exists();
    }

    /**
     * Determine whether the user can view specific task.
     */
    public function viewTask(User $user, Project $project): bool
    {
        // Project owner, admin, or task is assigned to user
        return $user->id === $project->user_id || 
               $project->users()
                      ->where('user_id', $user->id)
                      ->where(function ($query) use ($user) {
                          $query->where('role', 'admin')
                                ->orWhereHas('tasks', function ($query) use ($user) {
                                    $query->where('assigned_to', $user->id);
                                });
                      })
                      ->exists();
    }
}
