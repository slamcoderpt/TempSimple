import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Avatar from '@/Components/atoms/Avatar';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationSidebar from '@/Components/organisms/NotificationSidebar';
import axios from 'axios';

export default function AuthenticatedLayout({ header, children }) {
    const { user, menu_items = [] } = usePage().props.auth;
    console.log('menu_items:', menu_items);
    console.log('type:', typeof menu_items, Array.isArray(menu_items));

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(route('notifications.index'));
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.read_at).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notification) => {
        try {
            await axios.post(route('notifications.mark-as-read', notification.id));
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(route('notifications.mark-all-as-read'));
            await fetchNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const renderMenuItem = (item) => {
        if (item.type === 'dropdown') {
            return (
                <Dropdown key={item.id}>
                    <Dropdown.Trigger>
                        <button type="button" className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none">
                            {item.title}
                            <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        {item.children?.map(child => (
                            <Dropdown.Link 
                                key={child.id} 
                                href={child.url || (child.route_name ? route(child.route_name) : '#')}
                                type={child.type}
                                active={child.type !== 'fixed' && route().current(child.route_name)}
                            >
                                {child.title}
                            </Dropdown.Link>
                        ))}
                    </Dropdown.Content>
                </Dropdown>
            );
        }

        if (item.type === 'fixed') {
            const href = item.url || (item.route_name ? route(item.route_name) : '#');
            const isExternalUrl = item.url && (item.url.startsWith('http://') || item.url.startsWith('https://'));

            return isExternalUrl ? (
                <a
                    key={item.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                >
                    {item.title}
                </a>
            ) : (
                <Link
                    key={item.id}
                    href={href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                >
                    {item.title}
                </Link>
            );
        }

        return (
            <NavLink
                key={item.id}
                href={item.url}
                active={route().current(item.route_name)}
            >
                {item.title}
            </NavLink>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm mb-8 rounded-b-xl">
                <div className="mx-8 max-w-12xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('projects.index')}>
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {menu_items.map(renderMenuItem)}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <button
                                onClick={() => setShowNotifications(true)}
                                className="relative rounded-full bg-white p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <span className="sr-only">View notifications</span>
                                <BellIcon 
                                    className={`h-6 w-6 ${
                                        unreadCount > 0 
                                            ? 'text-indigo-600 hover:text-indigo-700' 
                                            : 'text-gray-400 hover:text-gray-500'
                                    }`} 
                                    aria-hidden="true" 
                                />
                                {unreadCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <div className="ml-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                <Avatar user={user} size="sm" className="mr-2" />
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        {menu_items.map(item => (
                            <ResponsiveNavLink
                                key={item.id}
                                href={item.url}
                                active={route().current(item.route_name)}
                            >
                                {item.title}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="flex items-center">
                                <Avatar user={user} size="md" className="mr-3" />
                                <div>
                                    <div className="text-base font-medium text-gray-800">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Notification Sidebar */}
            <NotificationSidebar
                show={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
            />

            {header && (
                <header className="bg-white shadow mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {header}
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
