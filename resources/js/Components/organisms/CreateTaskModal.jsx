import { useForm, usePage } from '@inertiajs/react';
import ResizableModal from '@/Components/atoms/ResizableModal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function CreateTaskModal({ show, onClose, project, users, fields }) {
    const { data, setData, post, processing, errors, reset } = useForm(
        fields?.reduce((acc, field) => ({
            ...acc,
            [field.key]: field.type === 'select' ? field.options?.values?.[0] || '' : '',
        }), {})
    );

    const submit = (e) => {
        e.preventDefault();
        
        // Send the form data directly with the property keys
        post(route('tasks.store', { project: project.id }), data, {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (errors) => {
                console.error('Task creation failed:', errors);
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleClose = () => {
        console.log('Handle close triggered');
        reset();
        onClose();
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'text':
                return (
                    <div key={field.id} className="mt-6">
                        <InputLabel htmlFor={field.key} value={field.name} />
                        <TextInput
                            id={field.key}
                            type="text"
                            className="mt-1 block w-full"
                            value={data[field.key] || ''}
                            onChange={(e) => setData(field.key, e.target.value)}
                        />
                        <InputError message={errors[field.key]} className="mt-2" />
                    </div>
                );
            case 'select':
                return (
                    <div key={field.id} className="mt-6">
                        <InputLabel htmlFor={field.key} value={field.name} />
                        <select
                            id={field.key}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data[field.key] || ''}
                            onChange={(e) => setData(field.key, e.target.value)}
                        >
                            {field.options?.values?.map(value => (
                                <option key={value} value={value}>
                                    {value.charAt(0).toUpperCase() + value.slice(1)}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors[field.key]} className="mt-2" />
                    </div>
                );
            case 'date':
                return (
                    <div key={field.id} className="mt-6">
                        <InputLabel htmlFor={field.key} value={field.name} />
                        <TextInput
                            id={field.key}
                            type="date"
                            className="mt-1 block w-full"
                            value={data[field.key] || ''}
                            onChange={(e) => setData(field.key, e.target.value)}
                        />
                        <InputError message={errors[field.key]} className="mt-2" />
                    </div>
                );
            case 'user':
                return (
                    <div key={field.id} className="mt-6">
                        <InputLabel htmlFor={field.key} value={field.name} />
                        <select
                            id={field.key}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data[field.key] || ''}
                            onChange={(e) => setData(field.key, e.target.value)}
                        >
                            <option value="">Select a user</option>
                            {users?.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors[field.key]} className="mt-2" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ResizableModal 
            show={show} 
            onClose={handleClose} 
            modalKey="create_task"
            size={usePage().props?.auth?.user?.preferences?.modal_size_create_task || project.modal_size || 'md'}
        >
            <form onSubmit={submit} className="p-6 flex flex-col h-full max-h-[90vh]">
                <h2 className="text-lg font-medium text-gray-900 flex-none">
                    Create New Task
                </h2>

                <div className="flex-1 overflow-y-auto my-6 pr-2">
                    {fields?.map(field => renderField(field))}
                </div>

                <div className="flex-none flex justify-end gap-3">
                    <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                    <PrimaryButton disabled={processing}>Create Task</PrimaryButton>
                </div>
            </form>
        </ResizableModal>
    );
} 