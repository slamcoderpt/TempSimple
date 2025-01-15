import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TableHeader from '@/Components/atoms/TableHeader';
import EditableCell from '@/Components/atoms/EditableCell';
import { TableProvider } from '@/Components/context/TableContext';
import TableSelectionActions from '@/Components/atoms/TableSelectionActions';
import TableRowControls from '@/Components/atoms/TableRowControls';
import { useTableSelection } from '@/Components/context/TableSelectionContext';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableRow } from '@/Components/atoms/SortableRow';

export default function TaskTable({ tasks: initialTasks, fields, users }) {
    // Sort tasks by position initially
    const [tasks, setTasks] = useState(
        [...initialTasks].sort((a, b) => a.position - b.position)
    );
    const [taskToDelete, setTaskToDelete] = useState(null);
    const { setHoveredRow } = useTableSelection();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Get the task being moved
                const movedTask = items[oldIndex];
                
                // Log the neighbors at the destination
                const prevTask = newItems[newIndex - 1];
                const nextTask = newItems[newIndex + 1];
                
                console.log('Neighbors at drop position:', {
                    prevTask: prevTask ? {
                        id: prevTask.id,
                        position: Number(prevTask.position)
                    } : 'none',
                    nextTask: nextTask ? {
                        id: nextTask.id,
                        position: Number(nextTask.position)
                    } : 'none',
                    dropIndex: newIndex,
                    totalItems: newItems.length
                });

                // Calculate new position between the surrounding items
                let newPosition;
                
                if (newIndex === 0) {
                    // If moved to start, use a round number before the first item
                    const nextPos = nextTask ? Math.floor(Number(nextTask.position)) : 0;
                    newPosition = nextPos > 0 ? nextPos - 1 : -1;
                } else if (newIndex === newItems.length - 1) {
                    // If moved to end, use a round number after the last item
                    const prevPos = prevTask ? Math.ceil(Number(prevTask.position)) : 0;
                    newPosition = prevPos + 1;
                } else {
                    // Position between the two surrounding items
                    const prevPos = Number(prevTask.position);
                    const nextPos = Number(nextTask.position);
                    
                    // If there's a gap of at least 2 between the positions, use a whole number
                    if (Math.floor(nextPos) - Math.ceil(prevPos) >= 2) {
                        newPosition = Math.floor(prevPos + 1);
                    } else {
                        // Otherwise use the average (decimal) position
                        newPosition = (prevPos + nextPos) / 2;
                    }
                }

                console.log('Position calculation:', {
                    prevPosition: prevTask?.position,
                    nextPosition: nextTask?.position,
                    calculatedPosition: newPosition,
                    isDecimal: newPosition % 1 !== 0
                });

                // Update only the moved item's position
                const updatedTasks = newItems.map((task, index) => {
                    if (task.id === movedTask.id) {
                        return { ...task, position: newPosition };
                    }
                    return task;
                });
                
                router.visit(route('tasks.reorder'), {
                    method: 'post',
                    data: {
                        tasks: [{
                            id: movedTask.id,
                            position: newPosition
                        }]
                    },
                    preserveScroll: true,
                });
                
                return updatedTasks;
            });
        }
    };

    return (
        <TableProvider>
            <div className="relative">
                <div className="overflow-x-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="divide-x divide-gray-200">
                                    {/* Controls Column Header */}
                                    <th className="w-16" />
                                    {fields.map((field, index) => (
                                        <TableHeader key={field.id}>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm">{field.icon}</span>
                                                <span>{field.name}</span>
                                            </div>
                                        </TableHeader>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <SortableContext
                                    items={tasks}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {tasks.map((task) => (
                                        <SortableRow
                                            key={task.id}
                                            id={task.id}
                                            task={task}
                                            fields={fields}
                                            users={users}
                                            onHover={setHoveredRow}
                                        />
                                    ))}
                                </SortableContext>
                            </tbody>
                        </table>
                    </DndContext>
                </div>
                <TableSelectionActions />
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
        </TableProvider>
    );
} 