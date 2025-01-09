import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import StatusBadge from '@/Components/atoms/StatusBadge';

export default function TaskTable({ tasks }) {
    const [taskToDelete, setTaskToDelete] = useState(null);

    const confirmTaskDeletion = (task) => {
        setTaskToDelete(task);
    };

    const deleteTask = () => {
        router.delete(route('tasks.destroy', taskToDelete.id), {
            onSuccess: () => setTaskToDelete(null),
        });
    };

    const closeModal = () => {
        setTaskToDelete(null);
    };

    return (
        <div className="flow-root">
            <div className="rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th scope="col" className="py-3 pl-4 text-left text-sm font-normal text-gray-500">
                                Title
                            </th>
                            <th scope="col" className="py-3 pl-4 text-left text-sm font-normal text-gray-500">
                                Description
                            </th>
                            <th scope="col" className="py-3 pl-4 text-left text-sm font-normal text-gray-500">
                                Status
                            </th>
                            <th scope="col" className="py-3 pl-4 text-left text-sm font-normal text-gray-500">
                                Due Date
                            </th>
                            <th scope="col" className="py-3 pl-4 text-left text-sm font-normal text-gray-500">
                                Assigned To
                            </th>
                            <th scope="col" className="relative py-3 pr-4">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
                                <td className="py-4 pl-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        {task.title}
                                    </div>
                                </td>
                                <td className="py-4 pl-4 text-sm text-gray-500">
                                    {task.description || '-'}
                                </td>
                                <td className="py-4 pl-4">
                                    <StatusBadge status={task.status} />
                                </td>
                                <td className="py-4 pl-4 text-sm text-gray-500">
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                </td>
                                <td className="py-4 pl-4 text-sm text-gray-500">
                                    {task.assigned_user ? task.assigned_user.name : '-'}
                                </td>
                                <td className="py-4 pr-4 text-right">
                                    <button
                                        onClick={() => confirmTaskDeletion(task)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={taskToDelete !== null} onClose={closeModal} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Delete Task
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Are you sure you want to delete this task? This action cannot be undone.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <DangerButton onClick={deleteTask}>Delete Task</DangerButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
} 