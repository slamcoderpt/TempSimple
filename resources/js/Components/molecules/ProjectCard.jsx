import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import StatusBadge from '@/Components/atoms/StatusBadge';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InlineText from '@/Components/atoms/InlineText';
import InlineIcon from '@/Components/atoms/InlineIcon';
import StackedAvatars from '@/Components/atoms/StackedAvatars';
import InlineTextarea from '@/Components/atoms/InlineTextarea';

export default function ProjectCard({ project }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const users = project.users || [];

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
            <Link href={`/projects/${project.id}`} className="block">
                <div className="relative">
                    <div className="relative flex flex-col overflow-visible rounded-lg bg-white shadow transition hover:shadow-md">
                        <div className="block rounded-lg border border-gray-200 p-6 hover:border-gray-300">
                            <div className="flex items-center gap-3">
                                <div className="editable-element" onClick={(e) => e.preventDefault()}>
                                    <InlineIcon 
                                        value={project.icon || '📁'} 
                                        route={route('projects.update', project.id)}
                                    />
                                </div>
                                <div className="flex-1 editable-element" onClick={(e) => e.preventDefault()}>
                                    <InlineText
                                        value={project.name}
                                        route={route('projects.update', project.id)}
                                        textClassName="text-lg font-medium text-gray-900 group-hover:text-gray-600"
                                    />
                                </div>
                                <StatusBadge status={project.status} />
                            </div>

                            <div className="mt-2" onClick={(e) => e.preventDefault()}>
                                <InlineTextarea
                                    value={project.description}
                                    route={route('projects.update', project.id)}
                                    textClassName="text-sm text-gray-600"
                                />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div onClick={(e) => e.preventDefault()}>
                                    <StackedAvatars 
                                        users={[project.user, ...users]} 
                                        project={project}
                                        canInvite={project.can_invite}
                                        availableUsers={[]}
                                    />
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowDeleteModal(true);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to delete this project?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Once this project is deleted, all of its resources and data will be permanently deleted.
                    </p>

                    <div className="mt-6 flex justify-end gap-4">
                        <SecondaryButton onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            className="ml-3"
                            disabled={isDeleting}
                            onClick={confirmDelete}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Project'}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </>
    );
} 