import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import useCardStore from '../../store/useCardStore';
import useListStore from '../../store/useListStore';
import CardDetailModal from './CardDetailModal';

const KanbanCard = ({ card, index, listId }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <>
      <Draggable draggableId={card._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setShowDetailModal(true)}
            className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 ${
              snapshot.isDragging ? 'opacity-50 rotate-3' : ''
            }`}
          >
            <h4 className="text-sm font-medium text-gray-900 mb-2">{card.title}</h4>
            
            {card.description && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{card.description}</p>
            )}

            <div className="flex items-center justify-between mt-2">
              {/* Labels */}
              {card.labels && card.labels.length > 0 && (
                <div className="flex space-x-1">
                  {card.labels.slice(0, 3).map((label, idx) => (
                    <span
                      key={idx}
                      className="w-8 h-2 rounded"
                      style={{ backgroundColor: label.color }}
                      title={label.text}
                    />
                  ))}
                </div>
              )}

              {/* Assignees */}
              {card.assignees && card.assignees.length > 0 && (
                <div className="flex -space-x-1">
                  {card.assignees.slice(0, 3).map((assignee) => (
                    <div
                      key={assignee._id}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white"
                      title={assignee.name}
                    >
                      {assignee.name?.substring(0, 1).toUpperCase()}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meta info */}
            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
              {card.dueDate && (
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(card.dueDate).toLocaleDateString()}
                </span>
              )}
              {card.comments && card.comments.length > 0 && (
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {card.comments.length}
                </span>
              )}
            </div>
          </div>
        )}
      </Draggable>

      {/* Card Detail Modal */}
      {showDetailModal && (
        <CardDetailModal
          cardId={card._id}
          listId={listId}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  );
};

export default KanbanCard;
