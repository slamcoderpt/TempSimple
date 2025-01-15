import { createContext, useContext, useState } from 'react';

const TableContext = createContext();

export function TableProvider({ children }) {
    const [selectedCell, setSelectedCell] = useState(null);

    return (
        <TableContext.Provider value={{ selectedCell, setSelectedCell }}>
            {children}
        </TableContext.Provider>
    );
}

export function useTableContext() {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext must be used within a TableProvider');
    }
    return context;
} 