export default function TableCell({ children, className = '' }) {
    return (
        <td className={`whitespace-nowrap px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 ${className}`}>
            {children}
        </td>
    );
} 