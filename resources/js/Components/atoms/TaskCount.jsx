export default function TaskCount({ count }) {
    return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {count} {count === 1 ? 'task' : 'tasks'}
        </span>
    );
} 