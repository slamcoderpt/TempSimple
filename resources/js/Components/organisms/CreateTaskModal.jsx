import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function CreateTaskModal({ show, onClose, project, users }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        due_date: '',
        assigned_user_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tasks.store', { project: project.id }), {
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
                    Create New Task
                </h2>

                <div className="mt-6">
                    <InputLabel htmlFor="title" value="Task Title" />
                    <TextInput
                        id="title"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                    />
                    <InputError message={errors.title} className="mt-2" />
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
                    <InputLabel htmlFor="priority" value="Priority" />
                    <select
                        id="priority"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <InputError message={errors.priority} className="mt-2" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="status" value="Status" />
                    <select
                        id="status"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                    </select>
                    <InputError message={errors.status} className="mt-2" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="assigned_user_id" value="Assigned To" />
                    <select
                        id="assigned_user_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={data.assigned_user_id}
                        onChange={(e) => setData('assigned_user_id', e.target.value)}
                    >
                        <option value="">Select a user</option>
                        {users?.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.assigned_user_id} className="mt-2" />
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
                    <PrimaryButton disabled={processing}>Create Task</PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 