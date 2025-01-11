import { useState, useRef, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import Avatar from '@/Components/atoms/Avatar';

const ROLE_OPTIONS = [
    {
        value: 'member',
        label: 'Member',
        description: 'Can view and interact with the project.',
        icon: (
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        )
    },
    {
        value: 'admin',
        label: 'Admin',
        description: 'Can manage project settings and members.',
        icon: (
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
            </svg>
        )
    }
];

export default function InviteUsersModal({ show, onClose, project, availableUsers = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const searchRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        role: 'member',
    });

    const filteredUsers = availableUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setData('user_id', user.id);
        setSearchQuery(user.name);
        setShowSuggestions(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.invite', project.id), {
            onSuccess: () => {
                reset();
                setSearchQuery('');
                setSelectedUser(null);
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        setSearchQuery('');
        setSelectedUser(null);
        onClose();
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Add User to Project
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Select a user to add to this project.
                </p>

                <div className="mt-6">
                    <InputLabel htmlFor="user_search" value="Search User" />
                    <div ref={searchRef} className="relative">
                        <input
                            type="text"
                            id="user_search"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                                setSelectedUser(null);
                                setData('user_id', '');
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="Search by name or email..."
                        />
                        {showSuggestions && searchQuery && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100"
                                            onClick={() => handleUserSelect(user)}
                                        >
                                            <Avatar user={user} size="sm" />
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                        No users found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <InputError message={errors.user_id} className="mt-2" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="role" value="Role" />
                    <div className="mt-1 space-y-2">
                        {ROLE_OPTIONS.map(role => (
                            <label
                                key={role.value}
                                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                                    data.role === role.value 
                                        ? 'border-indigo-500 ring-2 ring-indigo-500' 
                                        : 'border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={role.value}
                                    className="sr-only"
                                    checked={data.role === role.value}
                                    onChange={e => setData('role', e.target.value)}
                                />
                                <div className="flex w-full items-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                                        {role.icon}
                                    </div>
                                    <div className="ml-4">
                                        <p className={`text-sm font-medium ${
                                            data.role === role.value ? 'text-indigo-900' : 'text-gray-900'
                                        }`}>
                                            {role.label}
                                        </p>
                                        <p className={`text-sm ${
                                            data.role === role.value ? 'text-indigo-700' : 'text-gray-500'
                                        }`}>
                                            {role.description}
                                        </p>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                    <PrimaryButton disabled={processing || !selectedUser}>
                        {processing ? 'Adding...' : 'Add User'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 