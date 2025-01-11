import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function InlineText({ 
    value, 
    route, 
    textClassName = '', 
    placeholder = 'Click to edit...', 
    fieldName = 'description',
    type = 'text'
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const getDateStatus = (dateString) => {
        if (!dateString) return null;
        const dueDate = new Date(dateString);
        const today = new Date();
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'overdue';
        if (diffDays <= 3) return 'due-soon';
        return 'upcoming';
    };

    const getDateStatusStyles = (status) => {
        switch (status) {
            case 'overdue':
                return 'bg-red-50 text-red-700 ring-red-600/20';
            case 'due-soon':
                return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
            case 'upcoming':
                return 'bg-green-50 text-green-700 ring-green-600/20';
            default:
                return '';
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (text !== value && text !== '') {
            router.patch(route, {
                [fieldName]: type === 'date' ? new Date(text).toISOString().split('T')[0] : text
            }, {
                preserveScroll: true
            });
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setText('');
        setIsEditing(false);
        router.patch(route, {
            [fieldName]: null
        }, {
            preserveScroll: true
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && type !== 'date') {
            e.preventDefault();
            e.target.blur();
        }
        if (e.key === 'Escape') {
            setText(value);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return type === 'date' ? (
            <input
                type="date"
                value={formatDateForInput(text)}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${textClassName}`}
                autoFocus
            />
        ) : (
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${textClassName}`}
                autoFocus
            />
        );
    }

    return (
        <div
            onDoubleClick={() => setIsEditing(true)}
            className={`cursor-text ${textClassName} ${!value && 'text-gray-400'} group relative`}
            title="Double click to edit"
        >
            {type === 'date' && value ? (
                <div className="flex items-center gap-1 group/badge">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ${getDateStatusStyles(getDateStatus(value))}`}>
                        {formatDate(value)}
                    </span>
                    <button
                        onClick={handleClear}
                        className="rounded-md p-1 text-gray-400 hover:text-gray-500 opacity-0 group-hover/badge:opacity-100 transition-opacity"
                        type="button"
                        title="Clear date"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </button>
                </div>
            ) : (
                <span className="relative">
                    {value || placeholder}
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-indigo-600/50 transition-transform duration-150 ease-out group-hover:scale-x-100" />
                </span>
            )}
        </div>
    );
} 