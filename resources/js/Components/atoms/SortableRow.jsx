import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditableCell from '@/Components/atoms/EditableCell';
import TableRowControls from '@/Components/atoms/TableRowControls';

export function SortableRow({ id, task, fields, users, onHover }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: isDragging ? 'relative' : undefined,
        backgroundColor: isDragging ? 'white' : undefined,
    };

    return (
        <tr 
            ref={setNodeRef}
            style={style}
            className={`divide-x divide-gray-200 hover:bg-gray-50 ${isDragging ? 'shadow-lg' : ''}`}
            {...attributes}
        >
            {/* Controls Column */}
            <td 
                className="w-16 relative group"
                onMouseEnter={() => onHover(task.id)}
                onMouseLeave={() => onHover(null)}
            >
                <TableRowControls 
                    taskId={task.id} 
                    dragHandleProps={listeners}
                />
            </td>
            {fields.map((field, index) => (
                <EditableCell
                    key={field.id}
                    task={task}
                    field={field}
                    users={users}
                    isFirstCell={false}
                />
            ))}
        </tr>
    );
} 