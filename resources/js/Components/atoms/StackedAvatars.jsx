import { useState } from 'react';
import InviteUsersModal from '@/Components/organisms/InviteUsersModal';
import ManageUsersModal from '@/Components/organisms/ManageUsersModal';
import Avatar from '@/Components/atoms/Avatar';

export default function StackedAvatars({ users, project, canInvite = false, canManageUsers = false, limit = 5, availableUsers = [] }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    const displayUsers = users.slice(0, limit);
    const remainingCount = Math.max(0, users.length - limit);

    // Filter out users that are already in the project
    const filteredAvailableUsers = availableUsers.filter(
        availableUser => !users.some(user => user.id === availableUser.id)
    );

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <div 
                    className="flex items-center"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <div className="flex -space-x-2">
                        {displayUsers.map((user, index) => (
                            <div
                                key={user.id}
                                style={{ zIndex: displayUsers.length - index }}
                            >
                                <Avatar 
                                    user={user} 
                                    size="sm" 
                                    className="ring-2 ring-white"
                                />
                            </div>
                        ))}
                        {remainingCount > 0 && (
                            <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-sm font-medium text-gray-500 ring-2 ring-white">
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                </div>

                {canManageUsers && (
                    <>
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
                            title="Invite users"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowManageModal(true)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
                            title="Manage users"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
            
            {showTooltip && users.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-2 w-max rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
                    <div className="flex flex-col gap-1">
                        {users.map(user => (
                            <span key={user.id}>{user.name}</span>
                        ))}
                    </div>
                </div>
            )}

            <InviteUsersModal
                show={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                project={project}
                availableUsers={filteredAvailableUsers}
            />

            <ManageUsersModal
                show={showManageModal}
                onClose={() => setShowManageModal(false)}
                project={project}
                users={users}
            />
        </div>
    );
} 