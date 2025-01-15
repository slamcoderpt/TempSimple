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

    return (
        <TableSelectionContext.Provider value={{
            selectedRows,
            hoveredRow,
            setHoveredRow,
            toggleRowSelection,
            clearSelection
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