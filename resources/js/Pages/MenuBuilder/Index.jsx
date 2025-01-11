import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MenuTree from '@/Components/organisms/MenuTree';
import MenuItemForm from '@/Components/organisms/MenuItemForm';

export default function Index({ menuItems }) {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <AuthenticatedLayout>
            <Head title="Menu Builder" />

            <div className="mx-12 max-w-12xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-indigo-600/10 p-2.5">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                            Menu Builder
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mt-4 pb-12">
                <div className="max-w-12xl mx-12 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-3 gap-6">
                                {/* Menu Tree */}
                                <div className="col-span-1 border-r">
                                    <div className="pr-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Menu Structure
                                        </h3>
                                        <MenuTree
                                            items={menuItems}
                                            onSelectItem={setSelectedItem}
                                            selectedItemId={selectedItem?.id}
                                        />
                                    </div>
                                </div>

                                {/* Menu Item Form */}
                                <div className="col-span-2">
                                    <div className="pl-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            {selectedItem ? 'Edit Menu Item' : 'Create New Menu Item'}
                                        </h3>
                                        <MenuItemForm
                                            item={selectedItem}
                                            onCancel={() => setSelectedItem(null)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 