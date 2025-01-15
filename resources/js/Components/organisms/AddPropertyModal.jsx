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
import { PROPERTY_COLORS } from '@/Constants/propertyColors';
import ColorPicker from '@/Components/atoms/ColorPicker';

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

export default function AddPropertyModal({ show, onClose, onSave, editingProperty, project }) {
    const [data, setData] = useState(editingProperty ? {
        name: editingProperty.name,
        key: editingProperty.key,
        type: editingProperty.type,
        icon: editingProperty.icon,
        hidden: !editingProperty.is_visible,
        options: {
            ...editingProperty.options,
            values: editingProperty.options?.values || [],
            isMultiple: editingProperty.options?.isMultiple || false,
            notifyOnChange: editingProperty.options?.notifyOnChange || false
        },
    } : {
        name: '',
        key: '',
        type: 'text',
        icon: '📝',
        hidden: false,
        options: {
            values: [],
            isMultiple: false,
            notifyOnChange: false
        },
    });

    useEffect(() => {
        if (editingProperty) {
            console.log('Editing property:', editingProperty);
            setData({
                name: editingProperty.name,
                key: editingProperty.key,
                type: editingProperty.type,
                icon: editingProperty.icon || '📝',
                hidden: !editingProperty.is_visible,
                options: {
                    ...editingProperty.options,
                    values: editingProperty.options?.values || [],
                    isMultiple: editingProperty.options?.isMultiple || false,
                    notifyOnChange: editingProperty.options?.notifyOnChange || false
                },
            });
        } else {
            setData({
                name: '',
                key: '',
                type: 'text',
                icon: '📝',
                hidden: false,
                options: {
                    values: [],
                    isMultiple: false,
                    notifyOnChange: false
                },
            });
        }
    }, [editingProperty]);

    const [newOption, setNewOption] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const property = {
            ...editingProperty,
            name: data.name,
            key: data.key,
            type: data.type,
            icon: data.icon,
            is_visible: !data.hidden,
            options: {
                ...data.options,
                values: data.options.values || [],
                isMultiple: data.options.isMultiple || false,
                notifyOnChange: data.options.notifyOnChange || false
            }
        };

        console.log('Submitting property data:', property);
        onSave(property);
        handleClose();
    };

    const handleClose = () => {
        setData({
            name: '',
            key: '',
            type: 'text',
            icon: '📝',
            hidden: false,
            options: {
                values: [],
                isMultiple: false,
                notifyOnChange: false
            },
        });
        setNewOption('');
        setErrors({});
        onClose();
    };

    const addOption = () => {
        if (newOption.trim()) {
            const label = newOption.trim();
            const option = {
                value: slugify(label),
                label: label,
                color: 'gray'
            };
            setData({
                ...data,
                options: {
                    ...data.options,
                    values: [...(data.options.values || []), option]
                }
            });
            setNewOption('');
        }
    };

    const removeOption = (index) => {
        const newValues = [...(data.options.values || [])];
        newValues.splice(index, 1);
        setData({
            ...data,
            options: {
                ...data.options,
                values: newValues
            }
        });
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newValues = Array.from(data.options.values || []);
        const [reorderedItem] = newValues.splice(result.source.index, 1);
        newValues.splice(result.destination.index, 0, reorderedItem);

        setData({
            ...data,
            options: {
                ...data.options,
                values: newValues
            }
        });
    };

    const updateOptionColor = (index, color) => {
        const newValues = [...(data.options.values || [])];
        newValues[index] = {
            ...newValues[index],
            color
        };
        setData({
            ...data,
            options: {
                ...data.options,
                values: newValues
            }
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
                                                {(data.type === 'select' || data.type === 'user') && (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            id="isMultiple"
                                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                            checked={data.options.isMultiple}
                                                            onChange={e => setData({
                                                                ...data,
                                                                options: {
                                                                    ...data.options,
                                                                    isMultiple: e.target.checked
                                                                }
                                                            })}
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
                                                            checked={data.options.notifyOnChange}
                                                            onChange={e => setData({
                                                                ...data,
                                                                options: {
                                                                    ...data.options,
                                                                    notifyOnChange: e.target.checked
                                                                }
                                                            })}
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
                                                <div className="space-y-4">
                                                    <div>
                                                        <InputLabel value="Options" />
                                                        <div className="mt-2 space-y-2">
                                                            <div className="flex gap-2">
                                                                <TextInput
                                                                    type="text"
                                                                    className="flex-1"
                                                                    value={newOption}
                                                                    onChange={e => setNewOption(e.target.value)}
                                                                    placeholder="Add an option..."
                                                                    onKeyPress={e => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            addOption();
                                                                        }
                                                                    }}
                                                                />
                                                                <PrimaryButton type="button" onClick={addOption}>
                                                                    Add
                                                                </PrimaryButton>
                                                            </div>

                                                            <DragDropContext onDragEnd={handleDragEnd}>
                                                                <Droppable droppableId="options">
                                                                    {(provided) => (
                                                                        <div
                                                                            {...provided.droppableProps}
                                                                            ref={provided.innerRef}
                                                                            className="space-y-2"
                                                                        >
                                                                            {(data.options.values || []).map((option, index) => (
                                                                                <Draggable
                                                                                    key={option.value}
                                                                                    draggableId={option.value}
                                                                                    index={index}
                                                                                >
                                                                                    {(provided, snapshot) => (
                                                                                        <div
                                                                                            ref={provided.innerRef}
                                                                                            {...provided.draggableProps}
                                                                                            {...provided.dragHandleProps}
                                                                                            className={`flex items-center justify-between rounded-lg bg-white border border-gray-200 p-2 ${
                                                                                                snapshot.isDragging ? 'opacity-50' : ''
                                                                                            }`}
                                                                                        >
                                                                                            <div className="flex items-center gap-3 flex-1">
                                                                                                <ColorPicker
                                                                                                    color={option.color}
                                                                                                    onChange={(color) => updateOptionColor(index, color)}
                                                                                                />
                                                                                                <span className="text-gray-900">
                                                                                                    {option.label}
                                                                                                </span>
                                                                                            </div>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => removeOption(index)}
                                                                                                className="text-gray-400 hover:text-red-500"
                                                                                            >
                                                                                                <XMarkIcon className="h-4 w-4" />
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
                                                        </div>
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