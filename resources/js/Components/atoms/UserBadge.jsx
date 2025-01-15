import Avatar from '@/Components/atoms/Avatar';

export default function UserBadge({ user }) {
    if (!user) return '-';
    
    return (
        <div className="inline-flex items-center gap-1.5 max-w-[200px] rounded-full bg-gray-100 px-2 py-1">
            <Avatar user={user} size="xs" />
            <span className="truncate text-sm text-gray-700">{user.name}</span>
        </div>
    );
} 