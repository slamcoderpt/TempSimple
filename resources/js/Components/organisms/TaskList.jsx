import { Fragment, useState, useEffect } from 'react';
import clsx from 'clsx';
import TaskTable from '@/Components/molecules/TaskTable';
import TaskKanban from '@/Components/molecules/TaskKanban';
import CreateTaskModal from '@/Components/organisms/CreateTaskModal';
import { TableSelectionProvider } from '@/Components/context/TableSelectionContext';

export default function TaskList({ tasks, properties, project, users }) {
    const [selectedView, setSelectedView] = useState('table');
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [fields, setFields] = useState([]);

    useEffect(() => {
        setFields(properties.map(prop => ({
            id: prop.id,
            name: prop.name,
            key: prop.key,
            type: prop.type,
            icon: prop.icon,
            visible: prop.is_visible,
            options: prop.options
        })));
    }, [properties]);

    const handleModalClose = () => {
        setShowCreateTaskModal(false);
    };

    return (
        <div className="flex flex-col">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-5">
                    <button
                        onClick={() => setSelectedView('table')}
                        className={clsx(
                            'flex items-center whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium',
                            selectedView === 'table'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        )}
                    >
                        <svg className="mr-2 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                        </svg>
                        Table
                    </button>
                    <button
                        onClick={() => setSelectedView('kanban')}
                        className={clsx(
                            'flex items-center whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium',
                            selectedView === 'kanban'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        )}
                    >
                        <svg className="mr-2 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Kanban
                    </button>
                </nav>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 min-h-0">
                    {selectedView === 'table' ? (
                        <TableSelectionProvider>
                            <div className="bg-white mt-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <TaskTable tasks={tasks} fields={fields.filter(f => f.visible)} users={users} />
                            </div>
                        </TableSelectionProvider>
                    ) : (
                        <TaskKanban tasks={tasks} users={users} />
                    )}
                </div>
            </div>

            <CreateTaskModal
                show={showCreateTaskModal}
                onClose={handleModalClose}
                fields={fields.filter(f => f.visible)}
                project={project}
                users={users}
            />
        </div>
    );
} 