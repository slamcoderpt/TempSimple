import { useMemo } from 'react';

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 40%)`;
}

export default function Avatar({ 
    user, 
    className = '', 
    size = 'md',
    showStatus = false 
}) {
    const sizeClasses = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl'
    };

    const backgroundColor = useMemo(() => {
        if (!user.avatar_url) {
            return stringToColor(user.name);
        }
        return 'transparent';
    }, [user.name, user.avatar_url]);

    return (
        <div className="relative inline-block">
            <div
                className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-cover bg-center bg-no-repeat ${sizeClasses[size]} ${className}`}
                style={user.avatar_url ? {
                    backgroundImage: `url(${user.avatar_url})`
                } : {
                    backgroundColor
                }}
            >
                {!user.avatar_url && (
                    <span className="font-medium text-white">
                        {getInitials(user.name)}
                    </span>
                )}
            </div>
            {showStatus && (
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
            )}
        </div>
    );
} 