import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TaskList from '@/Components/organisms/TaskList';
import CreateTaskModal from '@/Components/organisms/CreateTaskModal';
import ProjectInfoPopover from '@/Components/molecules/ProjectInfoPopover';
import StackedAvatars from '@/Components/atoms/StackedAvatars';
import InlineText from '@/Components/atoms/InlineText';
import InlineIcon from '@/Components/atoms/InlineIcon';
import TableOptionsMenu from '@/Components/molecules/TableOptionsMenu';
import TablePropertiesPanel from '@/Components/organisms/TablePropertiesModal';
import TableLayoutsPanel from '@/Components/organisms/TableLayoutsModal';

export default function Show({ project, users, allUsers, canEdit, canManageMembers, properties }) {
    const { auth } = usePage().props;
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [showOptionsPanel, setShowOptionsPanel] = useState(false);
    const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
    const [showLayoutsPanel, setShowLayoutsPanel] = useState(false);

    const handleOpenProperties = () => {
        setShowOptionsPanel(false);
        setShowPropertiesPanel(true);
    };

    const handleOpenLayouts = () => {
        setShowOptionsPanel(false);
        setShowLayoutsPanel(true);
    };

    const handleBackToOptions = () => {
        setShowPropertiesPanel(false);
        setShowLayoutsPanel(false);
        setShowOptionsPanel(true);
    };

    return (
        <AuthenticatedLayout>
            
            <Head title={project.name} />
            <div className="max-w-8xl mx-12">
                <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                    <div className="flex items-center gap-4">
                        {canEdit ? (
                            <InlineIcon 
                                value={project.icon} 
                                route={route('projects.update', project.id)}
                                className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600/10"
                                iconClassName="text-2xl"
                            />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600/10 text-2xl">
                                {project.icon || '📁'}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                {canEdit ? (
                                    <InlineText
                                        value={project.name}
                                        route={route('projects.update', project.id)}
                                        textClassName="text-2xl font-semibold leading-7 text-gray-900"
                                    />
                                ) : (
                                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                                        {project.name}
                                    </h2>
                                )}
                                <ProjectInfoPopover project={project} canEdit={canEdit} />
                                {canEdit ? (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg className="mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <InlineText
                                            value={project.due_date}
                                            route={route('projects.update', project.id)}
                                            textClassName="hover:text-gray-700"
                                            placeholder="Set due date..."
                                            type="date"
                                            fieldName="due_date"
                                        />
                                    </div>
                                ) : project.due_date && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <svg className="mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        {new Date(project.due_date).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <StackedAvatars 
                                users={users} 
                                project={project}
                                canManageUsers={canManageMembers}
                                availableUsers={allUsers}
                            />
                            <button
                                onClick={() => setShowOptionsPanel(true)}
                                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowCreateTaskModal(true)}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                            </svg>
                            Add Task
                        </button>
                    </div>
                </div>
            </div>


            <div className="mt-4 pb-12">
                <div className="max-w-8xl mx-12">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex-1 min-h-0">
                                <TaskList 
                                    tasks={project.tasks} 
                                    properties={properties}
                                    project={project}
                                    users={users}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CreateTaskModal 
                show={showCreateTaskModal}
                onClose={() => setShowCreateTaskModal(false)}
                project={project}
                users={users}
                fields={properties}
            />

            <TableOptionsMenu 
                show={showOptionsPanel}
                onClose={() => setShowOptionsPanel(false)}
                onOpenProperties={handleOpenProperties}
                onOpenLayouts={handleOpenLayouts}
            />

            <TablePropertiesPanel
                show={showPropertiesPanel}
                onClose={() => setShowPropertiesPanel(false)}
                onBack={handleBackToOptions}
                fields={properties}
                project={project}
            />

            <TableLayoutsPanel
                show={showLayoutsPanel}
                onClose={() => setShowLayoutsPanel(false)}
                onBack={handleBackToOptions}
                project={project}
            />
        </AuthenticatedLayout>
    );
} 