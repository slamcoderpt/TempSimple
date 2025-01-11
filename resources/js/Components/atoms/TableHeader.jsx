export default function TableHeader({ children, className = '' }) {
    return (
        <th 
            scope="col" 
            className={`whitespace-nowrap px-3 py-2.5 text-left text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 ${className}`}
        >
            {children}
        </th>
    );
} 