import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import Select from 'react-select';
import UserBadge from '@/Components/atoms/UserBadge';
import StackedAvatars from '@/Components/atoms/StackedAvatars';
import { PROPERTY_COLORS } from '@/Constants/propertyColors';
import { useTableContext } from '@/Components/context/TableContext';
import { useTableSelection } from '@/Components/context/TableSelectionContext';
import TableRowControls from '@/Components/atoms/TableRowControls';

export default function EditableCell({ task, field, users, className = '', isFirstCell = false }) {
    const { selectedCell, setSelectedCell } = useTableContext();
    const { hoveredRow, setHoveredRow, selectedRows } = useTableSelection();
    const [isEditing, setIsEditing] = useState(false);
    const [showCopyButton, setShowCopyButton] = useState(false);
    const [value, setValue] = useState(() => {
        const propertyValue = task.properties?.find(
            prop => prop.property.key === field.key
        )?.value;
        return propertyValue ?? '';
    });

    const cellId = `${task.id}-${field.id}`;
    const isSelected = selectedCell === cellId;
    const isRowSelected = selectedRows.has(task.id);
    const isRowHovered = hoveredRow === task.id;

    useEffect(() => {
        // Clear selection when clicking outside
        const handleClickOutside = (e) => {
            if (!e.target.closest('td')) {
                setSelectedCell(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [setSelectedCell]);

    const handleClick = (e) => {
        e.stopPropagation();
        if (!isEditing) {
            setSelectedCell(cellId);
        }
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
        setSelectedCell(null);
    };

    const handleBlur = () => {
        setIsEditing(false);
        setSelectedCell(null);
        
        // Only update if value has changed
        const currentProperty = task.properties?.find(
            prop => prop.property.key === field.key
        );

        if (value !== currentProperty?.value) {
            console.log('Updating with:', {
                [field.id]: value
            });
            
            router.patch(route('tasks.update', task.id), {
                [field.id]: value
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        } else if (e.key === 'Escape') {
            // Reset to original value
            const propertyValue = task.properties?.find(
                prop => prop.property.key === field.key
            )?.value;
            setValue(propertyValue ?? '');
            setIsEditing(false);
            setSelectedCell(null);
        }
    };

    const handleCopy = (e) => {
        e.stopPropagation();
        const textToCopy = typeof value === 'string' ? value : String(value);
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast.success('Content copied to clipboard', {
                duration: 2000,
                position: 'bottom-center',
                style: {
                    background: '#F3F4F6',
                    color: '#1F2937',
                    fontSize: '0.875rem',
                }
            });
        });
    };

    // Custom styles for react-select to match Tailwind design
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: 'transparent',
            boxShadow: 'none',
            backgroundColor: 'white',
            minHeight: '34px',
            margin: '-1px',
            '&:hover': {
                borderColor: 'transparent'
            }
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
            'color': '#111827',
            margin: 0,
            padding: 0
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '0 8px'
        }),
        singleValue: (base) => ({
            ...base,
            'color': '#111827',
            margin: 0
        }),
        menu: (base) => ({
            ...base,
            zIndex: 50
        })
    };

    const handleSelectChange = (option) => {
        let newValue;
        if (field.options?.isMultiple) {
            // For multiple selections, handle array of values
            newValue = option ? option.map(opt => opt.value).join(',') : '';
        } else {
            // For single selections
            newValue = option?.value || '';
        }
        
        setValue(newValue);
        setIsEditing(false);
        setSelectedCell(null);

        const currentProperty = task.properties?.find(
            prop => prop.property.key === field.key
        );

        if (newValue !== currentProperty?.value) {
            router.patch(route('tasks.update', task.id), {
                [field.id]: newValue
            });
        }
    };

    const renderEditableContent = () => {
        if (!isEditing) {
            const content = (() => {
                switch (field.type) {
                    case 'text':
                        return value || '-';
                    case 'date':
                        return value ? new Date(value).toLocaleDateString() : '-';
                    case 'user':
                        const userIds = value ? value.split(',').filter(Boolean) : [];
                        const selectedUsers = userIds
                            .map(id => users.find(u => u.id === parseInt(id)))
                            .filter(Boolean);

                        if (selectedUsers.length === 0) return '-';
                        if (selectedUsers.length === 1) {
                            return <UserBadge user={selectedUsers[0]} />;
                        }
                        return <StackedAvatars users={selectedUsers} limit={3} />;
                    case 'select':
                        if (field.options?.isMultiple && value) {
                            const values = value.split(',');
                            return (
                                <div className="flex flex-wrap gap-1">
                                    {values.map(val => {
                                        const optionConfig = field.options?.values?.find(opt => opt.value === val);
                                        const color = optionConfig?.color || 'gray';
                                        const colorClasses = PROPERTY_COLORS.find(c => c.value === color);
                                        return (
                                            <span key={val} className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorClasses?.bg} ${colorClasses?.text}`}>
                                                {optionConfig?.label || val}
                                            </span>
                                        );
                                    })}
                                </div>
                            );
                        }
                        const optionConfig = field.options?.values?.find(opt => opt.value === value);
                        const color = optionConfig?.color || 'gray';
                        const colorClasses = PROPERTY_COLORS.find(c => c.value === color);
                        return value ? (
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colorClasses?.bg} ${colorClasses?.text}`}>
                                {optionConfig?.label || value}
                            </span>
                        ) : '-';
                    default:
                        return value || '-';
                }
            })();

            return (
                <div className="relative group flex items-center">
                    {content}
                    {showCopyButton && value && value !== '-' && (
                        <button
                            onClick={handleCopy}
                            className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded border border-gray-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                            </svg>
                        </button>
                    )}
                </div>
            );
        }

        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full bg-white border-0 focus:ring-0 px-3 py-2.5 -m-px"
                        autoFocus
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={value || ''}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full bg-white border-0 focus:ring-0 px-3 py-2.5 -m-px"
                        autoFocus
                    />
                );
            case 'user':
                const userOptions = users?.map(user => ({
                    value: user.id.toString(),
                    label: user.name
                })) || [];

                const selectedValues = value ? value.split(',').filter(Boolean) : [];

                return (
                    <Select
                        value={userOptions.filter(option => selectedValues.includes(option.value))}
                        onChange={handleSelectChange}
                        options={userOptions}
                        styles={selectStyles}
                        className="w-full"
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                        autoFocus
                        openMenuOnFocus
                        isClearable
                        isMulti={field.options?.isMultiple}
                        placeholder={`Select user${field.options?.isMultiple ? 's' : ''}...`}
                        onBlur={() => setIsEditing(false)}
                    />
                );
            case 'select':
                const options = field.options?.values?.map(option => ({
                    value: option.value,
                    label: option.label
                })) || [];

                const selectedSelectValues = value ? value.split(',').filter(Boolean) : [];

                return (
                    <Select
                        value={field.options?.isMultiple
                            ? options.filter(option => selectedSelectValues.includes(option.value))
                            : options.find(option => option.value === value)
                        }
                        onChange={handleSelectChange}
                        options={options}
                        styles={selectStyles}
                        className="w-full"
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                        autoFocus
                        openMenuOnFocus
                        isClearable
                        isMulti={field.options?.isMultiple}
                        placeholder={`Select option${field.options?.isMultiple ? 's' : ''}...`}
                        onBlur={() => setIsEditing(false)}
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full bg-white border-0 focus:ring-0 px-3 py-2.5 -m-px"
                        autoFocus
                    />
                );
        }
    };

    return (
        <td 
            className={clsx(
                'whitespace-nowrap text-sm text-gray-600 transition-colors relative',
                !isEditing && 'px-3 py-2.5',
                (isRowHovered || isRowSelected) && 'bg-gray-50',
                className
            )}
            style={isSelected ? { border: '1px solid blue' } : undefined}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => {
                setShowCopyButton(true);
                setHoveredRow(task.id);
            }}
            onMouseLeave={() => {
                setShowCopyButton(false);
                setHoveredRow(null);
            }}
        >
            {renderEditableContent()}
        </td>
    );
} 