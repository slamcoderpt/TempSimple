import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router } from '@inertiajs/react';
import { PROPERTY_ICONS } from '@/Constants/propertyIcons';

export default function AddPropertyModal({ show, onClose, onSave, editingProperty, project }) {
    const [data, setData] = useState({
        name: '',
        key: '',
        type: 'text',
        icon: '📝',
        hideInForm: true,
        isMultiple: false,
        notifyOnChange: false,
        includeTime: false,
        allowRange: false,
        defaultToToday: false,
        options: { values: [] }
    });

    useEffect(() => {
        if (editingProperty) {
            console.log('Editing property:', editingProperty);
            console.log('show_in_form:', editingProperty.show_in_form);
            setData({
                name: editingProperty.name,
                key: editingProperty.key,
                type: editingProperty.type,
                icon: editingProperty.icon || '📝',
                hideInForm: !editingProperty.show_in_form,
                isMultiple: editingProperty.options?.isMultiple || false,
                notifyOnChange: editingProperty.options?.notifyOnChange || false,
                includeTime: editingProperty.options?.includeTime || false,
                allowRange: editingProperty.options?.allowRange || false,
                defaultToToday: editingProperty.options?.defaultToToday || false,
                options: { 
                    values: editingProperty.options?.values || [] 
                }
            });
        } else {
            setData({
                name: '',
                key: '',
                type: 'text',
                icon: '📝',
                hideInForm: true,
                isMultiple: false,
                notifyOnChange: false,
                includeTime: false,
                allowRange: false,
                defaultToToday: false,
                options: { values: [] }
            });
        }
    }, [editingProperty]);

    const [newOption, setNewOption] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        const newErrors = {};
        if (!data.name.trim()) newErrors.name = 'Name is required';
        if (!data.icon) newErrors.icon = 'Icon is required';
        if (data.type === 'select' && data.options.values.length === 0) {
            newErrors.options = 'At least one option is required';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Generate key from name automatically if not editing
        const key = editingProperty ? data.key : data.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        
        // Prepare the data to be sent
        const propertyData = {
            name: data.name,
            key,
            type: data.type,
            icon: data.icon,
            show_in_form: !data.hideInForm,
            is_visible: editingProperty ? editingProperty.is_visible : true,
            options: {
                values: data.options.values,
                isMultiple: data.isMultiple,
                notifyOnChange: data.notifyOnChange,
                includeTime: data.includeTime,
                allowRange: data.allowRange,
                defaultToToday: data.defaultToToday,
            }
        };

        console.log('Submitting property data:', propertyData);
        onSave(propertyData);
        handleClose();
    };

    const handleClose = () => {
        setData({
            name: '',
            key: '',
            type: 'text',
            icon: '📝',
            hideInForm: true,
            isMultiple: false,
            notifyOnChange: false,
            includeTime: false,
            allowRange: false,
            defaultToToday: false,
            options: { values: [] }
        });
        setNewOption('');
        setErrors({});
        onClose();
    };

    const addOption = () => {
        if (newOption.trim()) {
            setData({
                ...data,
                options: {
                    values: [...data.options.values, newOption.trim()]
                }
            });
            setNewOption('');
        }
    };

    const removeOption = (index) => {
        const newValues = [...data.options.values];
        newValues.splice(index, 1);
        setData({
            ...data,
            options: { values: newValues }
        });
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newValues = Array.from(data.options.values);
        const [reorderedItem] = newValues.splice(result.source.index, 1);
        newValues.splice(result.destination.index, 0, reorderedItem);

        setData({
            ...data,
            options: { values: newValues }
        });
    };

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />

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
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <form onSubmit={handleSubmit} className="flex h-full flex-col bg-white shadow-xl">
                                        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                                            <Dialog.Title className="text-base font-semibold text-gray-900">
                                                {editingProperty ? 'Edit Property' : 'Add Property'}
                                            </Dialog.Title>
                                            <button
                                                type="button"
                                                className="rounded-md p-1 hover:bg-gray-100"
                                                onClick={handleClose}
                                            >
                                                <XMarkIcon className="h-5 w-5 text-gray-500" />
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                            <div>
                                                <InputLabel value="Icon" />
                                                <div className="mt-1 w-max rounded-lg border border-gray-200 bg-white p-2">
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {PROPERTY_ICONS.map(icon => (
                                                            <button
                                                                key={icon.value}
                                                                type="button"
                                                                onClick={() => setData({ ...data, icon: icon.value })}
                                                                className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all hover:scale-110 hover:bg-gray-100 ${
                                                                    data.icon === icon.value ? 'bg-indigo-50 ring-2 ring-indigo-500' : ''
                                                                }`}
                                                                title={icon.label}
                                                            >
                                                                {icon.value}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="name" value="Name" />
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.name}
                                                    onChange={e => setData({ ...data, name: e.target.value })}
                                                />
                                                <InputError message={errors.name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="type" value="Type" />
                                                <select
                                                    id="type"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    value={data.type}
                                                    onChange={e => setData({ ...data, type: e.target.value })}
                                                >
                                                    <option value="text">Text</option>
                                                    <option value="select">Select</option>
                                                    <option value="date">Date</option>
                                                    <option value="user">User</option>
                                                </select>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="hideInForm"
                                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                        checked={data.hideInForm}
                                                        onChange={e => setData({ ...data, hideInForm: e.target.checked })}
                                                    />
                                                    <InputLabel htmlFor="hideInForm" value="Hide in form" />
                                                </div>

                                                {(data.type === 'select' || data.type === 'user') && (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="isMultiple"
                                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                            checked={data.isMultiple}
                                                            onChange={e => setData({ ...data, isMultiple: e.target.checked })}
                                                        />
                                                        <InputLabel htmlFor="isMultiple" value="Allow multiple selections" />
                                                    </div>
                                                )}

                                                {data.type === 'user' && (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="notifyOnChange"
                                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                            checked={data.notifyOnChange}
                                                            onChange={e => setData({ ...data, notifyOnChange: e.target.checked })}
                                                        />
                                                        <InputLabel htmlFor="notifyOnChange" value="Notify user on change" />
                                                    </div>
                                                )}

                                                {data.type === 'date' && (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                id="includeTime"
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                                checked={data.includeTime}
                                                                onChange={e => setData({ ...data, includeTime: e.target.checked })}
                                                            />
                                                            <InputLabel htmlFor="includeTime" value="Include time" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                id="allowRange"
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                                checked={data.allowRange}
                                                                onChange={e => setData({ ...data, allowRange: e.target.checked })}
                                                            />
                                                            <InputLabel htmlFor="allowRange" value="Allow date range" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                id="defaultToToday"
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                                checked={data.defaultToToday}
                                                                onChange={e => setData({ ...data, defaultToToday: e.target.checked })}
                                                            />
                                                            <InputLabel htmlFor="defaultToToday" value="Default to today" />
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {data.type === 'select' && (
                                                <div>
                                                    <InputLabel value="Options" />
                                                    <div className="mt-2 space-y-2">
                                                        <DragDropContext onDragEnd={handleDragEnd}>
                                                            <Droppable droppableId="options">
                                                                {(provided) => (
                                                                    <div
                                                                        {...provided.droppableProps}
                                                                        ref={provided.innerRef}
                                                                        className="space-y-2"
                                                                    >
                                                                        {data.options.values.map((option, index) => (
                                                                            <Draggable
                                                                                key={option}
                                                                                draggableId={option}
                                                                                index={index}
                                                                            >
                                                                                {(provided, snapshot) => (
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        className={`flex items-center gap-2 ${
                                                                                            snapshot.isDragging ? 'opacity-50' : ''
                                                                                        }`}
                                                                                    >
                                                                                        <div className="flex-1 flex items-center gap-2">
                                                                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                                                                <path d="M4 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm8 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM4 9a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm8 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V9zm-8 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm8 0a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
                                                                                            </svg>
                                                                                            <span className="flex-1 px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-900">
                                                                                                {option}
                                                                                            </span>
                                                                                        </div>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => removeOption(index)}
                                                                                            className="text-gray-400 hover:text-gray-500"
                                                                                        >
                                                                                            <XMarkIcon className="h-5 w-5" />
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                        </DragDropContext>
                                                        <div className="flex gap-2">
                                                            <TextInput
                                                                type="text"
                                                                className="flex-1"
                                                                placeholder="Add new option"
                                                                value={newOption}
                                                                onChange={e => setNewOption(e.target.value)}
                                                                onKeyPress={e => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        addOption();
                                                                    }
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={addOption}
                                                                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                            >
                                                                <PlusIcon className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                        <InputError message={errors.options} className="mt-1" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-200 p-4 flex justify-end gap-3">
                                            {editingProperty && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
                                                            onClose();
                                                            router.delete(route('project.properties.destroy', { project: project.id, property: editingProperty.id }), {
                                                                preserveScroll: true,
                                                                preserveState: true,
                                                            });
                                                        }
                                                    }}
                                                    className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    Delete Property
                                                </button>
                                            )}
                                            <SecondaryButton type="button" onClick={handleClose}>Cancel</SecondaryButton>
                                            <PrimaryButton type="submit">{editingProperty ? 'Save Changes' : 'Add Property'}</PrimaryButton>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
} 