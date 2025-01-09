const statusClasses = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
};

export default function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
} 