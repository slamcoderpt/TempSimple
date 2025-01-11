import StatusBadge from '@/Components/atoms/StatusBadge';
import { Popover, Transition } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import InlineText from '@/Components/atoms/InlineText';

export default function ProjectInfoPopover({ project, canEdit }) {
    return (
        <Popover className="relative">
            <Popover.Button className="flex items-center text-gray-500 hover:text-gray-700">
                <InformationCircleIcon className="h-5 w-5" />
            </Popover.Button>

            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-80 -translate-x-1/2 transform px-4">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative bg-white p-4">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Description</h4>
                                    {canEdit ? (
                                        <InlineText
                                            value={project.description}
                                            route={route('projects.update', project.id)}
                                            textClassName="mt-1 text-sm text-gray-500"
                                            placeholder="Add a description..."
                                        />
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {project.description || 'No description provided.'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Status</h4>
                                    {canEdit ? (
                                        <select
                                            value={project.status}
                                            onChange={(e) => {
                                                router.put(route('projects.update', project.id), {
                                                    status: e.target.value
                                                });
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 py-1 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                            <option value="on_hold">On Hold</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                    ) : (
                                        <StatusBadge status={project.status} className="mt-1" />
                                    )}
                                </div>

                                {project.due_date && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Due Date</h4>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(project.due_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
} 