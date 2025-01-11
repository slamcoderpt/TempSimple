import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative inline-flex">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen} className="inline-flex">{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

const Content = ({ children }) => {
    const { open, setOpen } = useContext(DropDownContext);

    return (
        <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div
                className="absolute left-0 top-full z-50 mt-0.5 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                onClick={() => setOpen(false)}
            >
                {children}
            </div>
        </Transition>
    );
};

const DropdownLink = ({ href, active = false, children, type = 'link', ...props }) => {
    if (type === 'fixed') {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-50 hover:text-gray-900`}
                {...props}
            >
                {children}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={`block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-50 hover:text-gray-900 ${
                active ? 'bg-indigo-50 text-indigo-700 font-medium' : ''
            }`}
            {...props}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
