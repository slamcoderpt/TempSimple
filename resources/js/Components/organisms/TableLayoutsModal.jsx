import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import { RadioGroup } from '@headlessui/react';
import clsx from 'clsx';
import { MODAL_SIZES } from '@/utils/modalSizes';

const VIEW_LAYOUTS = [
    {
        id: 'modal',
        name: 'Modal',
        description: 'Opens in a centered modal dialog',
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
                <path d="M12 4v16" strokeWidth="2"/>
                <path d="M4 12h16" strokeWidth="2"/>
            </svg>
        ),
    },
    {
        id: 'side_panel',
        name: 'Side Panel',
        description: 'Slides in from the right side',
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" strokeWidth="2"/>
                <path d="M15 4v16" strokeWidth="2"/>
            </svg>
        ),
    },
    {
        id: 'page',
        name: 'Full Page',
        description: 'Opens in a new full page view',
        icon: (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2"/>
                <path d="M4 8h16" strokeWidth="2"/>
            </svg>
        ),
    },
];

export default function ViewLayoutPanel({ show, onClose, onBack, project }) {
    const [selectedLayout, setSelectedLayout] = useState(project.view_layout ?? 'modal');
    const [selectedModalSize, setSelectedModalSize] = useState(project.modal_size ?? 'md');
    const panelRef = useRef(null);

    // Update local state when project preferences change
    useEffect(() => {
        setSelectedLayout(project.view_layout ?? 'modal');
        setSelectedModalSize(project.modal_size ?? 'md');
    }, [project.view_layout, project.modal_size]);

    const handleLayoutChange = (layoutId) => {
        setSelectedLayout(layoutId);
        // Save layout preference to backend
        router.put(route('project.preferences.update', project.id), {
            view_layout: layoutId,
            modal_size: layoutId === 'modal' ? selectedModalSize : null,
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleModalSizeChange = (sizeId) => {
        setSelectedModalSize(sizeId);
        // Save modal size preference to backend
        router.put(route('project.preferences.update', project.id), {
            view_layout: selectedLayout,
            modal_size: sizeId,
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-50"
                onClose={onClose}
                initialFocus={panelRef}
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel 
                                    className="pointer-events-auto w-screen max-w-md"
                                    ref={panelRef}
                                >
                                    <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
                                            <button
                                                onClick={onBack}
                                                className="rounded-md p-1 hover:bg-gray-100"
                                            >
                                                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <span className="text-base font-semibold text-gray-900">View Layout</span>
                                            <button
                                                onClick={onClose}
                                                className="absolute right-4 rounded-md p-1 hover:bg-gray-100"
                                            >
                                                <XMarkIcon className="h-5 w-5 text-gray-500" />
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-4">
                                            <RadioGroup value={selectedLayout} onChange={handleLayoutChange}>
                                                <RadioGroup.Label className="sr-only">View Layout</RadioGroup.Label>
                                                <div className="space-y-4">
                                                    {VIEW_LAYOUTS.map((layout) => (
                                                        <RadioGroup.Option
                                                            key={layout.id}
                                                            value={layout.id}
                                                            className={({ checked, active }) =>
                                                                clsx(
                                                                    'relative block cursor-pointer rounded-lg border px-6 py-4',
                                                                    checked ? 'border-transparent' : 'border-gray-300',
                                                                    active ? 'border-indigo-600 ring-2 ring-indigo-600' : '',
                                                                    'hover:border-indigo-600'
                                                                )
                                                            }
                                                        >
                                                            {({ active, checked }) => (
                                                                <>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center">
                                                                            <div className="flex-shrink-0 text-gray-900">
                                                                                {layout.icon}
                                                                            </div>
                                                                            <div className="ml-4">
                                                                                <RadioGroup.Label
                                                                                    as="p"
                                                                                    className={clsx(
                                                                                        'font-medium',
                                                                                        checked ? 'text-indigo-900' : 'text-gray-900'
                                                                                    )}
                                                                                >
                                                                                    {layout.name}
                                                                                </RadioGroup.Label>
                                                                                <RadioGroup.Description
                                                                                    as="span"
                                                                                    className={clsx(
                                                                                        'inline text-sm',
                                                                                        checked ? 'text-indigo-700' : 'text-gray-500'
                                                                                    )}
                                                                                >
                                                                                    {layout.description}
                                                                                </RadioGroup.Description>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className={clsx(
                                                                                'h-5 w-5 rounded-full border flex items-center justify-center',
                                                                                checked ? 'border-transparent bg-indigo-600' : 'border-gray-300',
                                                                                active ? 'ring-2 ring-indigo-600' : ''
                                                                            )}
                                                                        >
                                                                            <span
                                                                                className={clsx(
                                                                                    'rounded-full bg-white',
                                                                                    checked ? 'h-2.5 w-2.5' : 'h-0 w-0'
                                                                                )}
                                                                                aria-hidden="true"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </RadioGroup.Option>
                                                    ))}
                                                </div>
                                            </RadioGroup>

                                            {selectedLayout === 'modal' && (
                                                <div className="mt-8">
                                                    <h3 className="text-sm font-medium text-gray-900 mb-4">Default Modal Size</h3>
                                                    <RadioGroup value={selectedModalSize} onChange={handleModalSizeChange}>
                                                        <RadioGroup.Label className="sr-only">Modal Size</RadioGroup.Label>
                                                        <div className="space-y-3">
                                                            {MODAL_SIZES.map((size) => (
                                                                <RadioGroup.Option
                                                                    key={size.id}
                                                                    value={size.id}
                                                                    className={({ checked, active }) =>
                                                                        clsx(
                                                                            'relative block cursor-pointer rounded-lg border px-6 py-3',
                                                                            checked ? 'border-transparent' : 'border-gray-300',
                                                                            active ? 'border-indigo-600 ring-2 ring-indigo-600' : '',
                                                                            'hover:border-indigo-600'
                                                                        )
                                                                    }
                                                                >
                                                                    {({ active, checked }) => (
                                                                        <>
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex flex-col">
                                                                                    <RadioGroup.Label
                                                                                        as="p"
                                                                                        className={clsx(
                                                                                            'font-medium',
                                                                                            checked ? 'text-indigo-900' : 'text-gray-900'
                                                                                        )}
                                                                                    >
                                                                                        {size.name}
                                                                                    </RadioGroup.Label>
                                                                                    <RadioGroup.Description
                                                                                        as="span"
                                                                                        className={clsx(
                                                                                            'text-sm',
                                                                                            checked ? 'text-indigo-700' : 'text-gray-500'
                                                                                        )}
                                                                                    >
                                                                                        {size.description}
                                                                                    </RadioGroup.Description>
                                                                                </div>
                                                                                <div
                                                                                    className={clsx(
                                                                                        'h-5 w-5 rounded-full border flex items-center justify-center',
                                                                                        checked ? 'border-transparent bg-indigo-600' : 'border-gray-300',
                                                                                        active ? 'ring-2 ring-indigo-600' : ''
                                                                                    )}
                                                                                >
                                                                                    <span
                                                                                        className={clsx(
                                                                                            'rounded-full bg-white',
                                                                                            checked ? 'h-2.5 w-2.5' : 'h-0 w-0'
                                                                                        )}
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </RadioGroup.Option>
                                                            ))}
                                                        </div>
                                                    </RadioGroup>
                                                </div>
                                            )}
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