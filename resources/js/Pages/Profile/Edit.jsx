import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateAvatarForm from './Partials/UpdateAvatarForm';
import { Head } from '@inertiajs/react';
import Avatar from '@/Components/atoms/Avatar';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="max-w-xl">
                            <section className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <Avatar user={auth.user} size="xl" />
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Profile Picture
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Update your profile picture. A square image works best.
                                        </p>
                                    </div>
                                </div>
                                <UpdateAvatarForm />
                            </section>
                        </div>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="max-w-xl">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="max-w-xl">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="max-w-xl">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
