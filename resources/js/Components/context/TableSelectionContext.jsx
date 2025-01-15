import { createContext, useContext, useState } from 'react';

const TableSelectionContext = createContext();

export function TableSelectionProvider({ children }) {
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [hoveredRow, setHoveredRow] = useState(null);

    const toggleRowSelection = (taskId) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    const clearSelection = () => {
        setSelectedRows(new Set());
    };

    const selectAll = (taskIds) => {
        setSelectedRows(prev => {
            // If all tasks are already selected, deselect all
            if (taskIds.every(id => prev.has(id))) {
                return new Set();
            }
            // Otherwise, select all tasks
            return new Set(taskIds);
        });
    };

    return (
        <TableSelectionContext.Provider value={{
            selectedRows,
            hoveredRow,
            setHoveredRow,
            toggleRowSelection,
            clearSelection,
            selectAll
        }}>
            {children}
        </TableSelectionContext.Provider>
    );
}

export function useTableSelection() {
    const context = useContext(TableSelectionContext);
    if (!context) {
        throw new Error('useTableSelection must be used within a TableSelectionProvider');
    }
    return context;
} 