<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserPreferenceController extends Controller
{
    public function update(Request $request)
    {
        $user = Auth::user();
        $preferences = $user->preferences ?? [];
        
        // Merge new preferences with existing ones
        $preferences = array_merge($preferences, $request->input('preferences', []));
        
        // Update user preferences
        $user->preferences = $preferences;
        $user->save();
        
        return back();
    }
} 