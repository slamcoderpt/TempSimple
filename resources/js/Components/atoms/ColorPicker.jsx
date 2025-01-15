import { Fragment, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { PROPERTY_COLORS } from '@/Constants/propertyColors';

export default function ColorPicker({ color, onChange }) {
    return (
        <Popover className="relative">
            <Popover.Button
                className={`h-6 w-6 rounded border border-gray-200 ${
                    PROPERTY_COLORS.find(c => c.value === color)?.bg
                } transition-all hover:ring-2 hover:ring-offset-1 focus:outline-none`}
            />

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="grid grid-cols-4 gap-1">
                        {PROPERTY_COLORS.map(colorOption => (
                            <button
                                key={colorOption.value}
                                type="button"
                                onClick={() => {
                                    onChange(colorOption.value);
                                }}
                                className={`flex h-8 w-8 items-center justify-center rounded ${colorOption.bg} ${colorOption.text} transition-all hover:ring-2 hover:ring-offset-1 ${
                                    color === colorOption.value ? 'ring-2 ring-offset-1 ring-indigo-500' : ''
                                }`}
                            >
                                {color === colorOption.value && (
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
} 