import { Fragment, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline';
import AddPropertyModal from './AddPropertyModal';
import { router } from '@inertiajs/react';

export default function TablePropertiesPanel({ show, onClose, fields, onSave, onBack, project }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const panelRef = useRef(null);

    const filteredFields = fields.filter(field =>
        field.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePropertyClick = (field) => {
        console.log('Clicking property:', field);
        setEditingProperty({
            ...field,
            show_in_form: field.show_in_form ?? !field.hideInForm,
            is_visible: field.is_visible ?? field.visible
        });
        setShowAddProperty(true);
    };

    const handleAddProperty = (newProperty) => {
        const endpoint = editingProperty 
            ? route('project.properties.update', { project: project.id, property: editingProperty.id })
            : route('project.properties.store', project.id);
            
        const method = editingProperty ? 'put' : 'post';

        console.log('Sending to backend:', newProperty);

        router[method](endpoint, newProperty, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                console.log('Response from backend:', response);
                const property = response?.props?.flash?.newProperty;
                
                if (!property) {
                    console.error('No property data received from backend');
                    return;
                }
                
                // Update the fields list with the new/updated property
                const updatedFields = editingProperty 
                    ? fields.map(f => f.id === property.id ? property : f)
                    : [...fields, property];
                    
                onSave(updatedFields);
                setShowAddProperty(false);
                setEditingProperty(null);
            },
            onError: (errors) => {
                console.error('Failed to save property:', errors);
            }
        });
    };

    const handleDeleteProperty = (fieldId) => {
        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            router.delete(route('project.properties.destroy', { project: project.id, property: fieldId }), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    const updatedFields = fields.filter(f => f.id !== fieldId);
                    onSave(updatedFields);
                },
            });
        }
    };

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-50"
                onClose={onClose}
                initialFocus={panelRef}
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel 
                                    className="pointer-events-auto w-screen max-w-md"
                                    ref={panelRef}
                                >
                                    <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
                                            <button
                                                onClick={onBack}
                                                className="rounded-md p-1 hover:bg-gray-100"
                                            >
                                                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <span className="text-base font-semibold text-gray-900">Properties</span>
                                            <button
                                                onClick={onClose}
                                                className="absolute right-4 rounded-md p-1 hover:bg-gray-100"
                                            >
                                                <XMarkIcon className="h-5 w-5 text-gray-500" />
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-4">
                                            <div className="relative mb-4">
                                                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    className="w-full rounded-md border-0 py-2 pl-9 pr-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                                    placeholder="Search for a property..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                {filteredFields.map((field) => (
                                                    <div
                                                        key={field.id}
                                                        className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-gray-50"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <span className="text-xl">{field.icon}</span>
                                                                <span 
                                                                    onClick={() => handlePropertyClick(field)}
                                                                    className="flex-1 cursor-pointer text-sm text-gray-900 hover:text-indigo-600"
                                                                >
                                                                    {field.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleDeleteProperty(field.id)}
                                                                className="text-gray-400 hover:text-red-500"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 p-4 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-2 text-sm text-gray-500">
                                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Hidden properties ({fields.filter(f => !f.visible).length})
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setShowAddProperty(true)}
                                                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-blue-600 hover:bg-gray-50"
                                            >
                                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                </svg>
                                                Add a property
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>

            <AddPropertyModal
                show={showAddProperty}
                onClose={() => {
                    setShowAddProperty(false);
                    setEditingProperty(null);
                }}
                onSave={handleAddProperty}
                editingProperty={editingProperty}
                project={project}
            />
        </Transition.Root>
    );
} 