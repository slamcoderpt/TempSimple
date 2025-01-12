import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { PROJECT_ICONS } from '@/Constants/projectIcons';

export default function CreateProjectModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        icon: '📁',
        name: '',
        description: '',
        status: 'active',
        due_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (errors) => {
                console.error('Project creation failed:', errors);
            }
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Create New Project
                </h2>

                <div className="mt-6 space-y-6">
                    <div>
                        <InputLabel htmlFor="icon" value="Icon" />
                        <div className="mt-1 w-max rounded-lg border border-gray-200 bg-white p-2">
                            <div className="grid grid-cols-5 gap-2">
                                {PROJECT_ICONS.map(icon => (
                                    <button
                                        key={icon.value}
                                        type="button"
                                        onClick={() => setData('icon', icon.value)}
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
                        <InputError message={errors.icon} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value="Project Name" />
                        <TextInput
                            id="name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <select
                            id="status"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                        </select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="due_date" value="Due Date" />
                        <TextInput
                            id="due_date"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                        />
                        <InputError message={errors.due_date} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>Create Project</PrimaryButton>
                        <SecondaryButton type="button" onClick={handleClose}>Cancel</SecondaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
} 