import { useCallback } from 'react';
import { useBoardStore } from '../../store/useBoardStore';

export const useDragAndDrop = () => {
  const { moveCard } = useBoardStore();

  const onDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move the card
    moveCard(
      draggableId,
      source.droppableId,
      destination.droppableId,
      destination.index
    );
  }, [moveCard]);

  return { onDragEnd };
};

export default useDragAndDrop;