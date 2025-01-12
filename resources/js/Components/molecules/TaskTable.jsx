import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import StatusBadge from '@/Components/atoms/StatusBadge';
import TableCell from '@/Components/atoms/TableCell';
import TableHeader from '@/Components/atoms/TableHeader';

export default function TaskTable({ tasks, fields, users }) {
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

    const renderCellContent = (task, field) => {
        // Find the property value in the task's properties array
        const propertyValue = task.properties?.find(
            prop => prop.property.key === field.key
        )?.value;

        if (propertyValue === undefined || propertyValue === null || propertyValue === '') {
            return '-';
        }
        
        switch (field.type) {
            case 'text':
                return propertyValue;
            case 'status':
                return <StatusBadge status={propertyValue} />;
            case 'date':
                return new Date(propertyValue).toLocaleDateString();
            case 'user':
                const user = users.find(u => u.id === parseInt(propertyValue));
                return user ? user.name : '-';
            case 'select':
                return (
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        getSelectStyles(field.key, propertyValue)
                    }`}>
                        {propertyValue.charAt(0).toUpperCase() + propertyValue.slice(1)}
                    </span>
                );
            default:
                return propertyValue;
        }
    };

    const getSelectStyles = (key, value) => {
        if (key === 'priority') {
            return value === 'high' ? 'bg-red-100 text-red-700' :
                   value === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                   'bg-green-100 text-green-700';
        }
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="flow-root">
            <div className="rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="divide-x divide-gray-200">
                            {fields.map(field => (
                                <TableHeader key={field.id}>
                                    {field.name}
                                </TableHeader>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr key={task.id} className="divide-x divide-gray-200">
                                {fields.map(field => (
                                    <TableCell key={field.id}>
                                        {field.key === 'title' ? (
                                            <div className="flex items-center gap-2">
                                                {renderCellContent(task, field)}
                                            </div>
                                        ) : (
                                            renderCellContent(task, field)
                                        )}
                                    </TableCell>
                                ))}
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