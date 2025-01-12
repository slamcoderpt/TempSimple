import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

const STATUSES = ['todo', 'in_progress', 'review', 'completed'];

const STATUS_CONFIGS = {
    todo: {
        title: 'To Do',
        color: 'bg-gray-50',
        borderColor: 'border-gray-200'
    },
    in_progress: {
        title: 'In Progress',
        color: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    review: {
        title: 'Review',
        color: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
    },
    completed: {
        title: 'Completed',
        color: 'bg-green-50',
        borderColor: 'border-green-200'
    }
};

export default function TaskKanban({ tasks, users }) {
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

    const tasksByStatus = STATUSES.reduce((acc, status) => {
        acc[status] = tasks.filter(task => task.status === status);
        return acc;
    }, {});

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {STATUSES.map(status => (
                <div
                    key={status}
                    className={`flex h-full w-80 shrink-0 flex-col rounded-lg ${STATUS_CONFIGS[status].color} ${STATUS_CONFIGS[status].borderColor} border p-4`}
                >
                    <h3 className="text-sm font-medium text-gray-900">
                        {STATUS_CONFIGS[status].title}
                        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-gray-600 shadow-sm">
                            {tasksByStatus[status].length}
                        </span>
                    </h3>

                    <div className="mt-4 flex flex-col gap-3">
                        {tasksByStatus[status].map(task => (
                            <div
                                key={task.id}
                                className="flex flex-col rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5"
                            >
                                <div className="flex items-start justify-between">
                                    <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                                    <button
                                        onClick={() => confirmTaskDeletion(task)}
                                        className="ml-2 text-gray-400 hover:text-red-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                {task.description && (
                                    <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                                )}
                                <div className="mt-2 flex items-center justify-between text-xs">
                                    {task.assigned_to && (
                                        <span className="text-gray-500">
                                            {users.find(u => u.id === task.assigned_to)?.name}
                                        </span>
                                    )}
                                    {task.due_date && (
                                        <span className="text-gray-500">
                                            Due {new Date(task.due_date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

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