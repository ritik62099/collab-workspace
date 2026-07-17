import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import useListStore from '../../store/useListStore';
import KanbanCard from './KanbanCard';
import AddCard from './AddCard';
import Dropdown, { DropdownItem } from '../common/Dropdown';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const KanbanList = ({ list, index, boardId, isDragging }) => {
  const { updateList, deleteList } = useListStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateList = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await updateList(list._id, { title });
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating list:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteList = async () => {
    if (!window.confirm('Delete this list and all its cards?')) return;
    try {
      await deleteList(list._id);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  return (
    <>
      <Draggable draggableId={list._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`flex-shrink-0 w-72 ${snapshot.isDragging ? 'opacity-50' : ''}`}
          >
            <div className="bg-gray-100 rounded-lg h-full flex flex-col max-h-[calc(100vh-250px)]">
              {/* List Header */}
              <div
                {...provided.dragHandleProps}
                className="p-3 flex items-center justify-between border-b border-gray-200 bg-gray-50 rounded-t-lg"
              >
                <h3 className="font-semibold text-gray-900 truncate flex-1">
                  {list.title}
                  <span className="ml-2 text-xs text-gray-500">
                    ({list.cards?.length || 0})
                  </span>
                </h3>
                <Dropdown
                  align="right"
                  trigger={
                    <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  }
                >
                  <DropdownItem
                    onClick={() => setShowEditModal(true)}
                    icon={({ className }) => (
                      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  >
                    Edit List
                  </DropdownItem>
                  <DropdownItem
                    onClick={handleDeleteList}
                    danger
                    icon={({ className }) => (
                      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  >
                    Delete List
                  </DropdownItem>
                </Dropdown>
              </div>

              {/* Cards Container */}
              <Droppable droppableId={list._id} type="CARD">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto p-2 space-y-2 ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : ''
                    }`}
                  >
                    {list.cards?.map((card, index) => (
                      <KanbanCard
                        key={card._id}
                        card={card}
                        index={index}
                        listId={list._id}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Add Card */}
              <div className="p-2">
                <AddCard listId={list._id} boardId={boardId} />
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {/* Edit List Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setTitle(list.title);
        }}
        title="Edit List"
        size="sm"
      >
        <form onSubmit={handleUpdateList} className="space-y-4">
          <Input
            label="List Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., To Do"
            required
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowEditModal(false);
                setTitle(list.title);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default KanbanList;
