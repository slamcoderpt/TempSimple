export default function StatusBadge({ status, className = '' }) {
    const getStatusStyles = () => {
        switch (status) {
            case 'active':
                return 'bg-green-50 text-green-700 ring-green-600/20';
            case 'completed':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20';
            case 'on_hold':
                return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
            case 'canceled':
                return 'bg-red-50 text-red-700 ring-red-600/20';
            default:
                return 'bg-gray-50 text-gray-700 ring-gray-600/20';
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'completed':
                return 'Completed';
            case 'on_hold':
                return 'On Hold';
            case 'canceled':
                return 'Canceled';
            default:
                return status;
        }
    };

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ${getStatusStyles()} ${className}`}>
            {getStatusLabel()}
        </span>
    );
} 