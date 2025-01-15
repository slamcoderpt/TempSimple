import { useTableSelection } from '@/Components/context/TableSelectionContext';

export default function TableRowControls({ taskId, dragHandleProps }) {
    const { toggleRowSelection, selectedRows, hoveredRow } = useTableSelection();
    const isSelected = selectedRows.has(taskId);
    const isHovered = hoveredRow === taskId;

    return (
        <div className="flex items-center justify-center gap-2 h-full">
            <div 
                className={`cursor-move p-1 hover:bg-gray-100 rounded transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                } group-hover:opacity-100`}
                {...dragHandleProps}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
            </div>
            <div className={`p-0.5 transition-opacity duration-200 ${
                isSelected || isHovered ? 'opacity-100' : 'opacity-0'
            } group-hover:opacity-100`}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRowSelection(taskId)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
        </div>
    );
} 