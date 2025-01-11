import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { PROJECT_ICONS } from '@/Constants/projectIcons';

export default function InlineIcon({ 
    value = '📁', 
    route,
    className = '',
    iconClassName = 'text-2xl'
}) {
    const [isSelecting, setIsSelecting] = useState(false);
    const containerRef = useRef(null);

    const handleIconClick = () => {
        setIsSelecting(true);
    };

    const handleIconSelect = (icon) => {
        if (icon !== value) {
            router.patch(route, { icon });
        }
        setIsSelecting(false);
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsSelecting(false);
        }
    };

    useEffect(() => {
        if (isSelecting) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isSelecting]);

    return (
        <div className={`relative ${className}`} ref={containerRef} style={{ zIndex: isSelecting ? 50 : 0 }}>
            <div
                onClick={handleIconClick}
                className={`group cursor-pointer transition-transform hover:scale-110 ${iconClassName}`}
                title="Click to change icon"
            >
                {value}
            </div>

            {isSelecting && (
                <div className="fixed z-[60] mt-1 w-max rounded-lg border border-gray-200 bg-white p-2 shadow-lg" style={{
                    top: containerRef.current?.getBoundingClientRect().bottom + window.scrollY + 4,
                    left: containerRef.current?.getBoundingClientRect().left + window.scrollX,
                }}>
                    <div className="grid grid-cols-5 gap-2">
                        {PROJECT_ICONS.map(icon => (
                            <button
                                key={icon.value}
                                onClick={() => handleIconSelect(icon.value)}
                                className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all hover:scale-110 hover:bg-gray-100 ${
                                    value === icon.value ? 'bg-indigo-50 ring-2 ring-indigo-500' : ''
                                }`}
                                title={icon.label}
                            >
                                {icon.value}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 