import StatusBadge from '@/Components/atoms/StatusBadge';

export default function ProjectInfoPopover({ project }) {
    return (
        <div className="group relative">
            <button
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600"
                aria-label="Project information"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
            <div className="absolute left-6 z-10 mt-2 hidden w-72 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Status</span>
                    <StatusBadge status={project.status} />
                </div>
                <div className="mt-3">
                    <span className="text-sm font-medium text-gray-900">Description</span>
                    <p className="mt-1 text-sm text-gray-500">
                        {project.description || 'No description provided'}
                    </p>
                </div>
                <div className="mt-3">
                    <span className="text-sm font-medium text-gray-900">Created</span>
                    <p className="mt-1 text-sm text-gray-500">
                        {new Date(project.created_at).toLocaleDateString()}
                    </p>
                </div>
                {project.due_date && (
                    <div className="mt-3">
                        <span className="text-sm font-medium text-gray-900">Due Date</span>
                        <p className="mt-1 text-sm text-gray-500">
                            {new Date(project.due_date).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 