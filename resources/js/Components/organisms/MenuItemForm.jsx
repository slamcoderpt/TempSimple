import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { useState, useEffect } from 'react';

export default function MenuItemForm({ item, onCancel }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: item?.title || '',
        type: item?.type || 'fixed',
        url: item?.url || '',
        route_name: item?.route_name || '',
        is_active: item?.is_active ?? true,
        dynamic_items_query: item?.dynamic_items_query || {
            type: 'projects',
            limit: 10,
            project_id: null,
        },
    });

    const [availableProjects, setAvailableProjects] = useState([]);

    useEffect(() => {
        setData({
            title: item?.title || '',
            type: item?.type || 'fixed',
            url: item?.url || '',
            route_name: item?.route_name || '',
            is_active: item?.is_active ?? true,
            dynamic_items_query: item?.dynamic_items_query || {
                type: 'projects',
                limit: 10,
                project_id: null,
            },
        });
    }, [item]);

    useEffect(() => {
        if (data.type === 'dynamic') {
            // Fetch available projects
            fetch(route('api.projects.list'))
                .then(response => response.json())
                .then(projects => setAvailableProjects(projects));
        }
    }, [data.type]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (item) {
            put(route('menu.update', item.id), {
                onSuccess: () => onCancel(),
            });
        } else {
            post(route('menu.store'), {
                onSuccess: () => onCancel(),
            });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this menu item?')) {
            router.delete(route('menu.destroy', item.id), {
                onSuccess: () => onCancel(),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="type" value="Type" />
                <select
                    id="type"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    value={data.type}
                    onChange={(e) => setData('type', e.target.value)}
                >
                    <option value="fixed">Fixed</option>
                    <option value="dynamic">Dynamic</option>
                    <option value="dropdown">Dropdown</option>
                </select>
                <InputError message={errors.type} className="mt-2" />
            </div>

            {data.type === 'fixed' && (
                <>
                    <div>
                        <InputLabel htmlFor="url" value="URL" />
                        <TextInput
                            id="url"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                            placeholder="e.g., /dashboard"
                        />
                        <InputError message={errors.url} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="route_name" value="Route Name" />
                        <TextInput
                            id="route_name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.route_name}
                            onChange={(e) => setData('route_name', e.target.value)}
                            placeholder="e.g., dashboard"
                        />
                        <InputError message={errors.route_name} className="mt-2" />
                    </div>
                </>
            )}

            {data.type === 'dynamic' && (
                <>
                    <div>
                        <InputLabel htmlFor="dynamic_type" value="Dynamic Type" />
                        <select
                            id="dynamic_type"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.dynamic_items_query.type}
                            onChange={(e) => setData('dynamic_items_query', {
                                ...data.dynamic_items_query,
                                type: e.target.value,
                            })}
                        >
                            <option value="projects">Projects</option>
                        </select>
                        <InputError message={errors.dynamic_items_query?.type} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="project" value="Select Project" />
                        <select
                            id="project"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.dynamic_items_query.project_id || ''}
                            onChange={(e) => setData('dynamic_items_query', {
                                ...data.dynamic_items_query,
                                project_id: e.target.value ? parseInt(e.target.value) : null,
                            })}
                        >
                            <option value="">All Projects</option>
                            {availableProjects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.dynamic_items_query?.project_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="limit" value="Limit" />
                        <TextInput
                            id="limit"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.dynamic_items_query.limit}
                            onChange={(e) => setData('dynamic_items_query', {
                                ...data.dynamic_items_query,
                                limit: parseInt(e.target.value),
                            })}
                            min="1"
                        />
                        <InputError message={errors.dynamic_items_query?.limit} className="mt-2" />
                    </div>
                </>
            )}

            {data.type === 'dropdown' && (
                <p className="text-sm text-gray-600">
                    This menu item will serve as a dropdown container. You can add child items by dragging them under this item.
                </p>
            )}

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="is_active"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                />
                <InputLabel htmlFor="is_active" value="Active" className="ml-2" />
                <InputError message={errors.is_active} className="mt-2" />
            </div>

            <div className="flex justify-end gap-4">
                {item && (
                    <DangerButton
                        type="button"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        Delete
                    </DangerButton>
                )}
                <SecondaryButton
                    type="button"
                    onClick={onCancel}
                    disabled={processing}
                >
                    Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    {item ? 'Update' : 'Create'}
                </PrimaryButton>
            </div>
        </form>
    );
} 