import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import StatusBadge from '@/Components/atoms/StatusBadge';
import TableCell from '@/Components/atoms/TableCell';
import TableHeader from '@/Components/atoms/TableHeader';

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
                        <tr className="divide-x divide-gray-200">
                            <TableHeader>Title</TableHeader>
                            <TableHeader>Description</TableHeader>
                            <TableHeader>Status</TableHeader>
                            <TableHeader>Due Date</TableHeader>
                            <TableHeader>Assigned To</TableHeader>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id} className="divide-x divide-gray-200">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {task.title}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-500">
                                    {task.description || '-'}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={task.status} />
                                </TableCell>
                                <TableCell className="text-gray-500">
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                </TableCell>
                                <TableCell className="text-gray-500">
                                    {task.assigned_user ? task.assigned_user.name : '-'}
                                </TableCell>
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