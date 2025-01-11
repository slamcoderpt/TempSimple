import { useState } from 'react';
import axios from 'axios';

export default function InlineTextarea({ value, route, textClassName = '', placeholder = 'No description provided' }) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);
    const [originalText, setOriginalText] = useState(value);

    const handleDoubleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
        setOriginalText(text);
    };

    const handleSubmit = async () => {
        try {
            await axios.patch(route, { description: text });
            setIsEditing(false);
            setOriginalText(text);
        } catch (error) {
            console.error('Error updating text:', error);
            setText(originalText);
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.metaKey) {
            handleSubmit();
        } else if (e.key === 'Escape') {
            setText(originalText);
            setIsEditing(false);
        }
    };

    const handleBlur = () => {
        if (text !== originalText) {
            handleSubmit();
        } else {
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                rows={3}
                autoFocus
                onClick={(e) => e.stopPropagation()}
            />
        );
    }

    return (
        <div
            onDoubleClick={handleDoubleClick}
            className={`group relative cursor-pointer ${textClassName}`}
        >
            <div className="relative">
                <p className="line-clamp-2">
                    {text || placeholder}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 group-hover:from-gray-50"></div>
            </div>
            <div className="absolute -inset-y-2 -inset-x-4 hidden rounded-lg group-hover:block group-hover:bg-gray-50/50"></div>
        </div>
    );
} 