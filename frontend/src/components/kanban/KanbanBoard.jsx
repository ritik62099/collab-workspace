import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import useListStore from '../../store/useListStore';
import useCardStore from '../../store/useCardStore';
import KanbanList from './KanbanList';
import AddList from './AddList';
import Loader from '../common/Loader';

const KanbanBoard = ({ boardId, lists: initialLists }) => {
  const { lists, setLists, reorderLists, moveCardBetweenLists } = useListStore();
  const { moveCard } = useCardStore();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialLists) {
      setLists(initialLists);
    }
  }, [initialLists, setLists]);

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = async (result) => {
    setIsDragging(false);
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle list reordering
    if (type === 'LIST') {
      reorderLists(source.index, destination.index);
      return;
    }

    // Handle card movement
    if (type === 'CARD') {
      const sourceListId = source.droppableId;
      const destListId = destination.droppableId;

      // Get the card being moved
      const sourceList = lists.find((list) => list._id === sourceListId);
      const card = sourceList?.cards[source.index];

      if (!card) return;

      // Optimistic update
      moveCardBetweenLists(sourceListId, destListId, card._id, destination.index);

      // API call
      try {
        await moveCard(card._id, destListId, destination.index);
      } catch (error) {
        console.error('Error moving card:', error);
        // Revert on error
        moveCardBetweenLists(destListId, sourceListId, card._id, source.index);
      }
    }
  };

  if (!lists.length && !boardId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" message="Loading board..." />
      </div>
    );
  }

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="LIST" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex space-x-4 overflow-x-auto pb-4 h-full"
          >
            {lists.map((list, index) => (
              <KanbanList
                key={list._id}
                list={list}
                index={index}
                boardId={boardId}
                isDragging={isDragging}
              />
            ))}
            {provided.placeholder}
            <AddList boardId={boardId} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
