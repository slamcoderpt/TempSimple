<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

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
            $project->can_invite = auth()->user()->can('update', $project);
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
            $project->load(['tasks.assigned_user']);
        } else {
            // Regular member - load only assigned tasks
            $project->load(['tasks' => function ($query) {
                $query->where('assigned_to', auth()->id());
            }, 'tasks.assigned_user']);
        }
        
        // Get project users including the owner
        $projectUsers = $project->users()
            ->get(['users.id', 'name', 'email'])
            ->push($project->user);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'users' => $projectUsers,
            'allUsers' => User::where('id', '!=', auth()->id())
                ->whereNotIn('id', $projectUsers->pluck('id'))
                ->get(['id', 'name', 'email']),
            'canEdit' => auth()->user()->can('update', $project),
            'canManageMembers' => auth()->user()->can('manageMembers', $project),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,completed,on_hold,canceled',
            'due_date' => 'nullable|date',
            'icon' => 'required|string|max:10',
        ]);

        $project = Auth::user()->projects()->create($validated);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project created successfully.');
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|in:active,completed,on_hold,canceled',
            'due_date' => 'sometimes|nullable|date',
            'icon' => 'sometimes|required|string|max:10',
        ]);

        $project->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Project updated successfully',
                'project' => $project
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
        $invitedUser = User::find($validated['user_id']);
        $invitedUser->notifications()->create([
            'type' => 'project.invitation',
            'message' => auth()->user()->name . ' invited you to join "' . $project->name . '"',
            'data' => [
                'project_id' => $project->id,
                'inviter_id' => auth()->id(),
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
