import { TableSelectionProvider } from '@/Components/context/TableSelectionContext';
import TableSelectionActions from '@/Components/atoms/TableSelectionActions';
import EditableCell from '@/Components/atoms/EditableCell';

export default function TasksTable({ tasks, fields, users }) {
    return (
        <TableSelectionProvider>
            <div className="relative">
                <div className="overflow-x-auto pl-14">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                {fields.map((field, index) => (
                                    <th
                                        key={field.id}
                                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {field.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tasks.map((task) => (
                                <tr key={task.id}>
                                    {fields.map((field, index) => (
                                        <EditableCell
                                            key={field.id}
                                            task={task}
                                            field={field}
                                            users={users}
                                            isFirstCell={index === 0}
                                        />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <TableSelectionActions />
            </div>
        </TableSelectionProvider>
    );
} 