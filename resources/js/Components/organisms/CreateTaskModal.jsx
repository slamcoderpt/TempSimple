import { useForm, usePage } from '@inertiajs/react';
import ResizableModal from '@/Components/atoms/ResizableModal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Select from 'react-select';

export default function CreateTaskModal({ show, onClose, project, users, fields }) {
    const { data, setData, post, processing, errors, reset } = useForm(
        fields?.reduce((acc, field) => ({
            ...acc,
            [field.key]: field.type === 'select' ? field.options?.values?.[0] || '' : '',
        }), {})
    );

    // Custom styles for react-select to match Tailwind design
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#6366F1' : '#D1D5DB',
            boxShadow: state.isFocused ? '0 0 0 1px #6366F1' : base.boxShadow,
            '&:hover': {
                borderColor: state.isFocused ? '#6366F1' : '#9CA3AF'
            },
            borderRadius: '0.375rem',
            backgroundColor: 'white'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected 
                ? '#6366F1' 
                : state.isFocused 
                    ? '#F3F4F6' 
                    : base.backgroundColor,
            '&:active': {
                backgroundColor: '#6366F1'
            }
        }),
        input: (base) => ({
            ...base,
            'color': '#111827'
        }),
        singleValue: (base) => ({
            ...base,
            'color': '#111827'
        })
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Send the form data directly with the property keys
        post(route('tasks.store', { project: project.id }), data, {
            onSuccess: () => {
                console.log('Task created successfully');
                reset();
                onClose();
            },
            onError: (errors) => {
                console.error('Task creation failed:', errors);
            },
            onFinish: () => {
                console.log('Task creation finished');
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleClose = () => {
        console.log('Handle close triggered');
        reset();
        onClose();
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'text':
                return (
                    <div key={field.id} className="mt-6">
                        <InputLabel htmlFor={field.key} value={field.name} />
                        <TextInput
                            id={field.key}
                            type="text"
                            className="mt-1 block w-full"
                            value={data[field.key] || ''}
                            onChange={(e) => setData(field.key, e.target.value)}
                        />
                        <InputError message={errors[field.key]} className="mt-2" />
                    </div>
                );
            case 'select':
                const options = field.options?.values?.map(option => ({
                    value: option.value,
                    label: option.label
                })) || [];
                
                return (
                    <div key={field.id} className="mt-6">
                        <InputLabel htmlFor={field.key} value={field.name} />
                        <Select
                            id={field.key}
                            options={options}
                            value={field.options?.isMultiple 
                                ? options.filter(option => 
                                    typeof data[field.key] === 'string' && data[field.key]?.split(',').includes(option.value)
                                  )
                                : options.find(option => option.value === data[field.key])
                            }
                            onChange={(option) => {
                                if (field.options?.isMultiple) {
                                    setData(field.key, option ? option.map(opt => opt.value).join(',') : '');
                                } else {
                                    setData(field.key, option?.value || '');
                                }
                            }}
                            isMulti={field.options?.isMultiple}
                            isClearable
                            className="mt-1"
                            styles={selectStyles}
                            placeholder={`Select option${field.options?.isMultiple ? 's' : ''}...`}
                        />
                        <InputError message={errors[field.key]} className="mt-2" />
                    </div>
                );
            case 'date':
                return (
                    <div key={field.id} className="mt-6">
                        <InputLabel htmlFor={field.key} value={field.name} />
                        <TextInput
                            id={field.key}
                            type="date"
                            className="mt-1 block w-full"
                            value={data[field.key] || ''}
                            onChange={(e) => setData(field.key, e.target.value)}
                        />
                        <InputError message={errors[field.key]} className="mt-2" />
                    </div>
                );
            case 'user':
                const userOptions = users?.map(user => ({
                    value: user.id.toString(),
                    label: user.name
                })) || [];

                return (
                    <div key={field.id} className="mt-6">
                        <InputLabel htmlFor={field.key} value={field.name} />
                        <Select
                            id={field.key}
                            options={userOptions}
                            value={field.options?.isMultiple 
                                ? userOptions.filter(option => 
                                    data[field.key]?.split(',').includes(option.value)
                                  )
                                : userOptions.find(option => option.value === data[field.key])
                            }
                            onChange={(option) => {
                                if (field.options?.isMultiple) {
                                    setData(field.key, option ? option.map(opt => opt.value).join(',') : '');
                                } else {
                                    setData(field.key, option?.value || '');
                                }
                            }}
                            isMulti={field.options?.isMultiple}
                            isClearable
                            className="mt-1"
                            styles={selectStyles}
                            placeholder={`Select user${field.options?.isMultiple ? 's' : ''}...`}
                        />
                        <InputError message={errors[field.key]} className="mt-2" />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ResizableModal 
            show={show} 
            onClose={handleClose} 
            modalKey="create_task"
            size={usePage().props?.auth?.user?.preferences?.modal_size_create_task || project.modal_size || 'md'}
        >
            <form onSubmit={submit} className="p-6 flex flex-col h-full max-h-[90vh]">
                <h2 className="text-lg font-medium text-gray-900 flex-none">
                    Create New Task
                </h2>

                <div className="flex-1 overflow-y-auto my-6 pr-2">
                    {fields?.map(field => renderField(field))}
                </div>

                <div className="flex-none flex justify-end gap-3">
                    <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
                    <PrimaryButton disabled={processing}>Create Task</PrimaryButton>
                </div>
            </form>
        </ResizableModal>
    );
} 