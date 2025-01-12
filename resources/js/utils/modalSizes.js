export const MODAL_SIZES = [
    {
        id: 'sm',
        name: 'Small',
        description: 'Compact view for simple forms',
        width: 'max-w-md',
    },
    {
        id: 'md',
        name: 'Medium',
        description: 'Standard size for most content',
        width: 'max-w-2xl',
    },
    {
        id: 'lg',
        name: 'Large',
        description: 'Spacious view for complex content',
        width: 'max-w-5xl',
    },
];

export function getModalSizeClass(project, modalType = 'create_task', defaultSize = 'md') {
    // First check if project has a modal size set for this specific modal type
    const modalSizeKey = `modal_size_${modalType}`;
    if (project?.preferences?.[modalSizeKey]) {
        const size = MODAL_SIZES.find(s => s.id === project.preferences[modalSizeKey]);
        if (size) {
            return size.width;
        }
    }

    // If no valid project modal size, use default
    const defaultSizeObj = MODAL_SIZES.find(s => s.id === defaultSize);
    return defaultSizeObj?.width || 'max-w-2xl'; // Fallback to medium if something goes wrong
} 