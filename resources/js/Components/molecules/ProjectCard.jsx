import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import StatusBadge from '@/Components/atoms/StatusBadge';
import TaskCount from '@/Components/atoms/TaskCount';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function ProjectCard({ project }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = () => {
        setIsDeleting(true);
        router.delete(route('projects.destroy', project.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <>
            <div className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow transition hover:shadow-md">
                <div className="flex-grow px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <Link
                            href={route('projects.show', project.id)}
                            className="text-xl font-semibold text-gray-900 hover:text-gray-600"
                        >
                            {project.name}
                        </Link>
                        <StatusBadge status={project.status} />
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {project.description || 'No description provided'}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                        <TaskCount count={project.tasks_count} />
                        {project.due_date && (
                            <span className="text-sm text-gray-500">
                                Due {new Date(project.due_date).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Delete Button */}
                <div className="absolute bottom-2 right-2">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-100 hover:text-red-500 focus:outline-none"
                        title="Delete project"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Delete Project
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Are you sure you want to delete this project? All tasks within this project will also be deleted. This action cannot be undone.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton 
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton 
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="relative"
                        >
                            {isDeleting ? (
                                <>
                                    <span className="opacity-0">Delete Project</span>
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                </>
                            ) : (
                                'Delete Project'
                            )}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </>
    );
} 