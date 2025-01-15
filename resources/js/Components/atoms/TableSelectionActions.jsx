import { useState } from 'react';
import { useTableSelection } from '@/Components/context/TableSelectionContext';
import { Transition } from '@headlessui/react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function TableSelectionActions() {
    const { selectedRows, clearSelection } = useTableSelection();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const selectedCount = selectedRows.size;

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('tasks.bulk-delete'), {
            data: {
                tasks: Array.from(selectedRows)
            },
            onSuccess: () => {
                setShowDeleteModal(false);
                clearSelection();
                setIsDeleting(false);
            },
            onError: () => {
                setIsDeleting(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const handleDuplicate = () => {
        setIsDuplicating(true);
        router.post(route('tasks.bulk-duplicate'), {
            tasks: Array.from(selectedRows)
        }, {
            onSuccess: () => {
                setShowDuplicateModal(false);
                clearSelection();
                setIsDuplicating(false);
            },
            onError: () => {
                setIsDuplicating(false);
            },
            onFinish: () => {
                setIsDuplicating(false);
            }
        });
    };

    if (selectedCount === 0) return null;

    return (
        <>
            <Transition
                show={selectedCount > 0}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
            >
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        {selectedCount} {selectedCount === 1 ? 'row' : 'rows'} selected
                    </span>
                    <div className="h-4 w-px bg-gray-200" />
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete selected rows"
                            disabled={isDeleting || isDuplicating}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowDuplicateModal(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Duplicate selected rows"
                            disabled={isDeleting || isDuplicating}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Transition>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => !isDeleting && setShowDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Delete Selected Tasks
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Are you sure you want to delete {selectedCount} {selectedCount === 1 ? 'task' : 'tasks'}? This action cannot be undone.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton 
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="relative"
                        >
                            {isDeleting ? (
                                <>
                                    <span className="opacity-0">Delete Tasks</span>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                </>
                            ) : (
                                'Delete Tasks'
                            )}
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            {/* Duplicate Confirmation Modal */}
            <Modal show={showDuplicateModal} onClose={() => !isDuplicating && setShowDuplicateModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Duplicate Selected Tasks
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Are you sure you want to duplicate {selectedCount} {selectedCount === 1 ? 'task' : 'tasks'}?
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton 
                            onClick={() => setShowDuplicateModal(false)}
                            disabled={isDuplicating}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton 
                            onClick={handleDuplicate}
                            disabled={isDuplicating}
                            className="relative"
                        >
                            {isDuplicating ? (
                                <>
                                    <span className="opacity-0">Duplicate Tasks</span>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                </>
                            ) : (
                                'Duplicate Tasks'
                            )}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </>
    );
} 