import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function CreateProjectModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
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

                <div className="mt-6">
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

                <div className="mt-6">
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

                <div className="mt-6">
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
                    </select>
                    <InputError message={errors.status} className="mt-2" />
                </div>

                <div className="mt-6">
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

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                    <PrimaryButton disabled={processing}>Create Project</PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 