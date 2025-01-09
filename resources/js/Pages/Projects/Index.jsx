import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProjectCard from '@/Components/molecules/ProjectCard';
import CreateProjectButton from '@/Components/molecules/CreateProjectButton';
import CreateProjectModal from '@/Components/organisms/CreateProjectModal';

export default function Index({ projects }) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Projects" />

            <div className="min-h-screen bg-gray-50/50">
                <div className="mt-8 sm:mt-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-indigo-600/10 p-2.5">
                                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                                    Projects
                                </h2>
                            </div>
                            <CreateProjectButton
                                onClick={() => setShowCreateModal(true)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pb-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {projects.length === 0 ? (
                            <div className="rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5">
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <h3 className="mt-4 text-sm font-semibold text-gray-900">No projects</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by creating a new project.
                                    </p>
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(true)}
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                            </svg>
                                            New Project
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <CreateProjectModal 
                    show={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                />
            </div>
        </AuthenticatedLayout>
    );
} 