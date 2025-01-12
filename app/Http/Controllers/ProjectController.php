<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        // Get projects where user is owner or member
        $projects = Project::where(function ($query) {
            $query->where('user_id', Auth::id())
                  ->orWhereHas('users', function ($query) {
                      $query->where('users.id', Auth::id());
                  });
        })
        ->withCount('tasks')
        ->with(['users' => function ($query) {
            $query->select('users.id', 'name', 'email', 'avatar');
        }, 'user' => function ($query) {
            $query->select('id', 'name', 'email', 'avatar');
        }])
        ->latest()
        ->get()
        ->map(function ($project) {
            $project->can_invite = Gate::allows('update', $project);
            return $project;
        });

        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);

        // Load tasks based on user role and permissions
        if ($this->authorize('viewAllTasks', $project, false)) {
            // Admin or owner - load all tasks
            $project->load(['tasks.properties.property', 'properties' => function($query) {
                $query->orderBy('order');
            }]);
        } else {
            // Regular member - load only assigned tasks where the user is assigned in properties
            $project->load(['tasks' => function ($query) {
                $query->whereHas('properties', function ($query) {
                    $query->whereHas('property', function ($query) {
                        $query->where('key', 'assigned_to');
                    })->where('value', Auth::id());
                });
            }, 'tasks.properties.property', 'properties' => function($query) {
                $query->orderBy('order');
            }]);
        }
        
        // Get project users including the owner
        $projectUsers = $project->users()
            ->get(['users.id', 'name', 'email'])
            ->push($project->user);

        // Transform tasks to include property values
        $tasks = $project->tasks->map(function ($task) {
            $properties = collect($task->properties)->mapWithKeys(function ($property) {
                return [$property->property->key => $property->value];
            });
            
            return array_merge(
                $task->only(['id', 'project_id', 'created_at', 'updated_at']),
                $properties->toArray()
            );
        });

        // Log for debugging
        Log::info('Transformed tasks', [
            'tasks' => $tasks->toArray()
        ]);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'users' => $projectUsers,
            'allUsers' => User::where('id', '!=', Auth::id())
                ->whereNotIn('id', $projectUsers->pluck('id'))
                ->get(['id', 'name', 'email']),
            'canEdit' => Gate::allows('update', $project),
            'canManageMembers' => Gate::allows('manageMembers', $project),
            'tasks' => $tasks,
            'properties' => $project->properties->values(),
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Project creation started', ['request_data' => $request->all()]);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'required|string|max:10',
                'description' => 'nullable|string',
                'status' => 'required|in:active,completed,on_hold,canceled',
                'due_date' => 'nullable|date',
                'assigned_to' => 'nullable|exists:users,id',
            ]);

            $project = DB::transaction(function () use ($validated) {
                $project = new Project($validated);
                $project->user_id = Auth::id();
                $project->save();
                Log::info('Project created', ['project_id' => $project->id]);
                return $project;
            });

            Log::info('Project creation completed', ['project_id' => $project->id]);

            return redirect()->route('projects.show', $project)
                ->with('success', 'Project created successfully.');
        } catch (\Exception $e) {
            Log::error('Project creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Failed to create project. ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'sometimes|required|string|max:10',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:active,completed,on_hold,canceled',
            'due_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $project->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Project updated successfully',
                'project' => $project->fresh()
            ]);
        }

        return back()->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    public function invite(Request $request, Project $project)
    {
        $this->authorize('manageMembers', $project);
        
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role' => ['required', 'in:member,admin'],
        ]);

        // Check if user is already in project
        if ($project->users()->where('user_id', $validated['user_id'])->exists()) {
            return back()->withErrors(['user_id' => 'User is already in the project']);
        }

        $project->users()->attach($validated['user_id'], [
            'role' => $validated['role']
        ]);

        // Create notification for invited user
        $invitedUser = User::findOrFail($validated['user_id']);
        $invitedUser->notifications()->create([
            'type' => 'project.invitation',
            'message' => Auth::user()->name . ' invited you to join "' . $project->name . '"',
            'data' => [
                'project_id' => $project->id,
                'inviter_id' => Auth::id(),
                'role' => $validated['role']
            ],
            'action_url' => route('projects.show', $project->id)
        ]);

        return back();
    }

    public function removeUser(Project $project, User $user)
    {
        $this->authorize('manageMembers', $project);

        // Don't allow removing the project owner
        if ($user->id === $project->user_id) {
            return back()->withErrors(['error' => 'Cannot remove the project owner.']);
        }

        $project->users()->detach($user->id);

        return back()->with('success', 'User removed from project successfully.');
    }

    public function updateUser(Request $request, Project $project, User $user)
    {
        $this->authorize('manageMembers', $project);

        // Don't allow updating the project owner's role
        if ($user->id === $project->user_id) {
            return back()->withErrors(['error' => 'Cannot change the project owner\'s role.']);
        }

        $validated = $request->validate([
            'role' => ['required', 'in:member,admin'],
        ]);

        $project->users()->updateExistingPivot($user->id, [
            'role' => $validated['role']
        ]);

        return back()->with('success', 'User role updated successfully.');
    }
}
