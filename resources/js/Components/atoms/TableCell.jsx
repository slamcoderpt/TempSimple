import { useState } from 'react';
import clsx from 'clsx';

export default function TableCell({ children, className = '' }) {
    const [isSelected, setIsSelected] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleClick = () => {
        setIsSelected(true);
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
        setIsSelected(false);
    };

    const handleBlur = () => {
        setIsEditing(false);
        setIsSelected(false);
    };

    return (
        <td 
            className={clsx(
                'whitespace-nowrap px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50',
                isSelected && 'ring-2 ring-indigo-500',
                className
            )}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
        >
            {children}
        </td>
    );
} 