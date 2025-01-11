<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MenuController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('projects.index');
    }
    return Inertia::render('Auth/Login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('projects.index');
    })->name('dashboard');

    // Projects
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::patch('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Tasks
    Route::post('/projects/{project}/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::patch('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');

    Route::post('/projects/{project}/invite', [ProjectController::class, 'invite'])->name('projects.invite');

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])
        ->name('notifications.mark-all-as-read');

    // Menu Builder Routes
    Route::get('/menu-builder', [MenuController::class, 'index'])->name('menu.index');
    Route::post('/menu-items', [MenuController::class, 'store'])->name('menu.store');
    Route::put('/menu-items/{menuItem}', [MenuController::class, 'update'])->name('menu.update');
    Route::delete('/menu-items/{menuItem}', [MenuController::class, 'destroy'])->name('menu.destroy');
    Route::post('/menu-items/reorder', [MenuController::class, 'reorder'])->name('menu.reorder');

    Route::delete('projects/{project}/users/{user}', [ProjectController::class, 'removeUser'])
        ->name('projects.users.remove');
    Route::put('projects/{project}/users/{user}', [ProjectController::class, 'updateUser'])
        ->name('projects.users.update');
});

require __DIR__.'/auth.php';
