import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getModalSizeClass } from '@/utils/modalSizes';
import clsx from 'clsx';

export default function ProjectModal({ 
    show, 
    onClose, 
    project,
    title,
    children,
    footer = null,
    modalType = 'create_task',
}) {
    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel 
                                className={clsx(
                                    'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full',
                                    getModalSizeClass(project, modalType)
                                )}
                            >
                                <div className="flex h-full flex-col">
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                                        <Dialog.Title as="h3" className="text-base font-semibold text-gray-900">
                                            {title}
                                        </Dialog.Title>
                                        <button
                                            type="button"
                                            className="rounded-md p-1 hover:bg-gray-100"
                                            onClick={onClose}
                                        >
                                            <XMarkIcon className="h-5 w-5 text-gray-500" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 overflow-y-auto p-4">
                                        {children}
                                    </div>

                                    {/* Footer */}
                                    {footer && (
                                        <div className="border-t border-gray-200 px-4 py-3">
                                            {footer}
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
} 