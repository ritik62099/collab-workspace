import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useBoardStore } from '../../store/useBoardStore';
import { useSocket } from '../../hooks/useSocket';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const BoardView = () => {
  const { id } = useParams();
  const { currentBoard, lists, loading, fetchBoard, addList } = useBoardStore();
  const { onDragEnd } = useDragAndDrop();
  
  // Initialize Socket for real-time updates
  useSocket(id);

  // State for adding a new list
  const [isAddingList, setIsAddingList] = React.useState(false);
  const [newListTitle, setNewListTitle] = React.useState('');

  useEffect(() => {
    if (id) {
      fetchBoard(id);
    }
  }, [id]);

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    try {
      await addList({ title: newListTitle, boardId: id });
      setNewListTitle('');
      setIsAddingList(false);
    } catch (error) {
      console.error('Failed to add list:', error);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!currentBoard) return <div className="p-10 text-center">Board not found.</div>;

  return (
    <div className="h-[calc(100vh-64px)] overflow-x-auto overflow-y-hidden bg-[#0079BF] p-6">
      <h1 className="text-2xl font-bold text-white mb-6">{currentBoard.title}</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="LIST">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="flex items-start space-x-4 h-full"
            >
              {lists.map((list, index) => (
                <Draggable key={list._id} draggableId={list._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-gray-100 rounded-lg w-80 flex-shrink-0 max-h-full flex flex-col shadow-md"
                    >
                      {/* List Header */}
                      <div 
                        {...provided.dragHandleProps} 
                        className="p-3 font-semibold text-gray-700 flex justify-between items-center"
                      >
                        {list.title}
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                          {list.cards?.length || 0}
                        </span>
                      </div>

                      {/* Cards Container */}
                      <Droppable droppableId={list._id} type="CARD">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 overflow-y-auto p-2 space-y-2 transition-colors ${
                              snapshot.isDraggingOver ? 'bg-blue-50' : ''
                            }`}
                          >
                            {list.cards?.map((card, index) => (
                              <Draggable key={card._id} draggableId={card._id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                  >
                                    <p className="text-sm text-gray-800">{card.title}</p>
                                    {card.labels && card.labels.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {card.labels.map((label, i) => (
                                          <span 
                                            key={i} 
                                            className="text-xs px-2 py-0.5 rounded text-white"
                                            style={{ backgroundColor: label.color }}
                                          >
                                            {label.name}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* Add Card Button (Placeholder for now) */}
                      <div className="p-2">
                        <button className="w-full text-left text-sm text-gray-500 hover:bg-gray-200 p-2 rounded transition-colors">
                          + Add a card
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Add New List Form */}
              {isAddingList ? (
                <form onSubmit={handleAddList} className="bg-gray-100 rounded-lg w-80 flex-shrink-0 p-3">
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Enter list title..."
                    className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <Button type="submit" size="sm">Add List</Button>
                    <Button variant="secondary" size="sm" onClick={() => setIsAddingList(false)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg w-80 flex-shrink-0 transition-colors"
                >
                  + Add another list
                </button>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default BoardView;