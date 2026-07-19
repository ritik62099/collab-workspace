import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useBoardStore } from '../../store/useBoardStore';
import { useSocket } from '../../hooks/useSocket';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { SOCKET_EVENTS } from '../../utils/socketEvents';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const BoardView = () => {
  const { id } = useParams();
  const { currentBoard, lists, loading, fetchBoard, addList, addCard } = useBoardStore();
  const { onDragEnd } = useDragAndDrop();
  const { socket } = useSocket(id);
  
  // List State
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  // Card State
  const [addingCardToList, setAddingCardToList] = useState(null); // Stores listId
  const [newCardTitle, setNewCardTitle] = useState('');

  useEffect(() => {
    if (id) {
      fetchBoard(id);
    }
  }, [id]);

  // 🚀 REAL-TIME SOCKET LISTENERS
  useEffect(() => {
    if (!socket) return;

    // Jab koi dusra user card move kare
    socket.on(SOCKET_EVENTS.CARD_MOVED, (data) => {
      // Hum optimistic update pehle hi kar chuke hain, lekin agar remote user ne kiya toh state sync karo
      // (Zustand store mein hum baad mein proper sync add kar sakte hain, abhi ke liye fetchBoard se refresh safe hai)
      fetchBoard(id); 
    });

    // Jab koi dusra user naya card add kare
    socket.on(SOCKET_EVENTS.CARD_CREATED, (data) => {
      fetchBoard(id);
    });

    return () => {
      socket.off(SOCKET_EVENTS.CARD_MOVED);
      socket.off(SOCKET_EVENTS.CARD_CREATED);
    };
  }, [socket, id]);

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

  const handleAddCard = async (listId, e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    try {
      await addCard({ title: newCardTitle, listId, boardId: id });
      
      // Emit Socket Event for Real-time update
      if (socket) {
        socket.emit(SOCKET_EVENTS.CARD_CREATED, { boardId: id, listId });
      }

      setNewCardTitle('');
      setAddingCardToList(null);
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!currentBoard) return <div className="p-10 text-center text-white">Board not found.</div>;

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
                        className="p-3 font-semibold text-gray-700 flex justify-between items-center cursor-grab active:cursor-grabbing"
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
                                    className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
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

                      {/* Add Card Form */}
                      {addingCardToList === list._id ? (
                        <form onSubmit={(e) => handleAddCard(list._id, e)} className="p-2">
                          <Input
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            placeholder="Enter a title for this card..."
                            className="mb-2"
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <Button type="submit" size="sm">Add Card</Button>
                            <Button variant="secondary" size="sm" onClick={() => {
                              setAddingCardToList(null);
                              setNewCardTitle('');
                            }}>Cancel</Button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setAddingCardToList(list._id)}
                          className="w-full text-left text-sm text-gray-500 hover:bg-gray-200 p-2 rounded transition-colors flex items-center space-x-2"
                        >
                          <span>+</span>
                          <span>Add a card</span>
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Add New List Form */}
              {isAddingList ? (
                <form onSubmit={handleAddList} className="bg-gray-100 rounded-lg w-80 flex-shrink-0 p-3">
                  <Input
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Enter list title..."
                    className="mb-2"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <Button type="submit" size="sm">Add List</Button>
                    <Button variant="secondary" size="sm" onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle('');
                    }}>Cancel</Button>
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