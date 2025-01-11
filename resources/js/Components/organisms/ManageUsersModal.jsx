import { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Avatar from '@/Components/atoms/Avatar';
import { router } from '@inertiajs/react';

export default function ManageUsersModal({ show, onClose, project, users }) {
    const [processing, setProcessing] = useState(false);

    const handleRemoveUser = (userId) => {
        if (!confirm('Are you sure you want to remove this user from the project?')) return;
        
        setProcessing(true);
        router.delete(route('projects.users.remove', { project: project.id, user: userId }), {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const handleRoleChange = (userId, newRole) => {
        setProcessing(true);
        router.put(route('projects.users.update', { project: project.id, user: userId }), {
            role: newRole
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Manage Project Users
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Manage users and their permissions in this project.
                </p>

                <div className="mt-6">
                    <div className="space-y-4">
                        {users.map(user => {
                            const isOwner = user.id === project.user_id;
                            return (
                                <div key={user.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar user={user} size="sm" />
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <select
                                            value={user.pivot?.role || 'member'}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            disabled={processing || isOwner}
                                            className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="member">Member</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <button
                                            onClick={() => !isOwner && handleRemoveUser(user.id)}
                                            disabled={processing || isOwner}
                                            className={`transition-colors duration-150 ${
                                                isOwner 
                                                    ? 'text-gray-300 cursor-not-allowed' 
                                                    : 'text-red-500 hover:text-red-700'
                                            }`}
                                            title={isOwner ? "Cannot remove project owner" : "Remove user"}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>
                        Close
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
} 