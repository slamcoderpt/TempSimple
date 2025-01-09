import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TaskList from '@/Components/organisms/TaskList';
import CreateTaskModal from '@/Components/organisms/CreateTaskModal';
import ProjectInfoPopover from '@/Components/molecules/ProjectInfoPopover';

export default function Show({ project, users }) {
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            {project.name}
                        </h2>
                        <ProjectInfoPopover project={project} />
                    </div>
                    <button
                        onClick={() => setShowCreateTaskModal(true)}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                        Add Task
                    </button>
                </div>
            }
        >
            <Head title={project.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <TaskList tasks={project.tasks} />
                        </div>
                    </div>
                </div>
            </div>

            <CreateTaskModal 
                show={showCreateTaskModal}
                onClose={() => setShowCreateTaskModal(false)}
                project={project}
                users={users}
            />
        </AuthenticatedLayout>
    );
} 