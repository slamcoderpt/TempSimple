import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { router } from '@inertiajs/react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const MenuItem = ({ item, level = 0, onSelectItem, selectedItemId, index }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <Draggable draggableId={item.id.toString()} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="mb-1"
                >
                    <div
                        className={`
                            flex items-center p-2 rounded-md cursor-pointer
                            ${selectedItemId === item.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}
                        `}
                    >
                        <div {...provided.dragHandleProps} className="mr-2">
                            ⋮⋮
                        </div>
                        <div 
                            className="flex-1 flex items-center"
                            style={{ paddingLeft: `${level * 20}px` }}
                            onClick={() => onSelectItem(item)}
                        >
                            {(hasChildren || item.type === 'dropdown') && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(!isExpanded);
                                    }}
                                    className="mr-1"
                                >
                                    {isExpanded ? (
                                        <ChevronDownIcon className="h-4 w-4" />
                                    ) : (
                                        <ChevronRightIcon className="h-4 w-4" />
                                    )}
                                </button>
                            )}
                            <span className="mr-2">{item.icon}</span>
                            <span>{item.title}</span>
                            {item.type === 'dynamic' && (
                                <span className="ml-2 text-xs text-gray-500">
                                    (Dynamic)
                                </span>
                            )}
                            {item.type === 'dropdown' && (
                                <span className="ml-2 text-xs text-gray-500">
                                    (Dropdown)
                                </span>
                            )}
                        </div>
                    </div>
                    {(hasChildren || item.type === 'dropdown') && isExpanded && (
                        <div className="ml-4">
                            <Droppable droppableId={`children-${item.id}`}>
                                {(provided) => (
                                    <div 
                                        ref={provided.innerRef} 
                                        {...provided.droppableProps}
                                        className={`
                                            ${item.type === 'dropdown' && !hasChildren ? 'min-h-[40px] border-2 border-dashed border-gray-200 rounded-md mt-2' : ''}
                                        `}
                                    >
                                        {item.children?.map((child, index) => (
                                            <MenuItem
                                                key={child.id}
                                                item={child}
                                                level={level + 1}
                                                onSelectItem={onSelectItem}
                                                selectedItemId={selectedItemId}
                                                index={index}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default function MenuTree({ items, onSelectItem, selectedItemId }) {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const sourceId = result.draggableId;
        const destinationId = result.destination.droppableId.replace('children-', '');
        const newIndex = result.destination.index;

        // Don't do anything if dropped in the same position
        if (
            result.source.droppableId === result.destination.droppableId &&
            result.source.index === result.destination.index
        ) {
            return;
        }

        router.post(route('menu.reorder'), {
            menuItemId: sourceId,
            newParentId: destinationId === 'root' ? null : destinationId,
            newOrder: newIndex,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="root">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-1"
                    >
                        {items.map((item, index) => (
                            <MenuItem
                                key={item.id}
                                item={item}
                                onSelectItem={onSelectItem}
                                selectedItemId={selectedItemId}
                                index={index}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
} 