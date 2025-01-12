<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Validator;

class ProjectPreferenceController extends Controller
{
    use AuthorizesRequests;

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validator = Validator::make($request->all(), [
            'view_layout' => ['sometimes', 'required', 'string', 'in:modal,side_panel,page'],
            'modal_size' => ['nullable', 'string', 'in:sm,md,lg'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $data = [];
        
        if ($request->has('view_layout')) {
            $data['view_layout'] = $request->view_layout;
            
            // Only store modal_size if view_layout is modal
            if ($request->view_layout === 'modal' && $request->has('modal_size')) {
                $data['modal_size'] = $request->modal_size;
            } else {
                $data['modal_size'] = null;
            }
        }

        $project->update($data);

        return back();
    }
}
