import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export default function NotificationSidebar({ show, onClose, notifications, onMarkAsRead, onMarkAllAsRead }) {
    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                                    Notifications
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                                                        onClick={onClose}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="divide-y divide-gray-200">
                                                {notifications.length === 0 ? (
                                                    <p className="text-center text-gray-500 py-4">
                                                        No notifications
                                                    </p>
                                                ) : (
                                                    notifications.map((notification) => (
                                                        <Link
                                                            key={notification.id}
                                                            href={notification.action_url}
                                                            className={`block px-4 py-4 hover:bg-gray-50 ${
                                                                notification.read_at ? 'opacity-75' : ''
                                                            }`}
                                                            onClick={() => {
                                                                if (!notification.read_at) {
                                                                    onMarkAsRead(notification);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm font-medium ${
                                                                        notification.read_at ? 'text-gray-600' : 'text-gray-900'
                                                                    }`}>
                                                                        {notification.message}
                                                                    </p>
                                                                    <p className="text-sm text-gray-500 truncate">
                                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                                {!notification.read_at && (
                                                                    <div className="flex-shrink-0">
                                                                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
} 