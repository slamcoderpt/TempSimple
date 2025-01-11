import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function UpdateAvatarForm({ className = '' }) {
    const fileInput = useRef();
    const [previewUrl, setPreviewUrl] = useState(null);
    const { data, setData, post, progress, processing, errors, reset } = useForm({
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (data.avatar) {
            post(route('profile.avatar.update'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('avatar');
                    setPreviewUrl(null);
                },
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <input
                        type="file"
                        ref={fileInput}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <div className="mt-4 flex items-center gap-4">
                        {previewUrl && (
                            <div className="relative h-20 w-20 overflow-hidden rounded-full">
                                <img
                                    src={previewUrl}
                                    alt="Avatar preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => fileInput.current?.click()}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                        >
                            Select New Image
                        </button>
                    </div>
                    <InputError message={errors.avatar} className="mt-2" />
                </div>

                {progress && (
                    <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="absolute h-full bg-indigo-600 transition-all duration-150"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {data.avatar && (
                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Saving...' : 'Save'}
                        </PrimaryButton>
                        <button
                            type="button"
                            className="text-sm text-gray-600 hover:text-gray-900"
                            onClick={() => {
                                reset('avatar');
                                setPreviewUrl(null);
                            }}
                            disabled={processing}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
} 