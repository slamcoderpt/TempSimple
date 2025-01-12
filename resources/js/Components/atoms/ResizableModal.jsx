import { Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { router } from '@inertiajs/react';

const MODAL_SIZES = {
    sm: 'max-w-lg',
    md: 'max-w-3xl',
    lg: 'max-w-7xl',
};

export default function ResizableModal({ 
    show = false, 
    onClose, 
    size = 'md',
    children,
    title,
    modalKey,
    className = ''
}) {
    const handleSizeChange = useCallback((newSize) => {
        if (modalKey && newSize !== size) {
            router.put(route('user-preferences.update'), {
                preferences: {
                    [`modal_size_${modalKey}`]: newSize
                }
            }, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    }, [modalKey, size]);

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

                <div className="fixed inset-0 z-10 overflow-y-auto">
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
                                className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full ${MODAL_SIZES[size]} ${className}`}
                            >
                                <div className="absolute right-0 top-0 pr-4 pt-4 flex gap-2">
                                    <div className="flex gap-1">
                                        {Object.keys(MODAL_SIZES).map((sizeOption) => (
                                            <button
                                                key={sizeOption}
                                                onClick={() => handleSizeChange(sizeOption)}
                                                className={`rounded-md p-1 hover:bg-gray-100 ${
                                                    size === sizeOption ? 'text-indigo-600' : 'text-gray-400'
                                                }`}
                                                title={`${sizeOption === 'sm' ? 'Small' : sizeOption === 'md' ? 'Medium' : 'Large'} size`}
                                            >
                                                <span className="sr-only">Set modal size to {sizeOption}</span>
                                                <svg className={`h-4 w-4 ${sizeOption === 'sm' ? 'scale-75' : sizeOption === 'lg' ? 'scale-125' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-md p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-500"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
} 