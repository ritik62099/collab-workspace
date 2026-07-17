import React, { useState, useEffect } from 'react';
import useCardStore from '../../store/useCardStore';
import useListStore from '../../store/useListStore';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Loader from '../common/Loader';

const CardDetailModal = ({ cardId, listId, isOpen, onClose }) => {
  const { currentCard, fetchCardById, updateCard, deleteCard, clearCurrentCard } = useCardStore();
  const { removeCardFromList, updateCardInList } = useListStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && cardId) {
      fetchCardById(cardId);
    }
    return () => {
      clearCurrentCard();
    };
  }, [isOpen, cardId, fetchCardById, clearCurrentCard]);

  useEffect(() => {
    if (currentCard) {
      setFormData({
        title: currentCard.title || '',
        description: currentCard.description || '',
      });
    }
  }, [currentCard]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const updatedCard = await updateCard(cardId, formData);
      updateCardInList(listId, cardId, updatedCard);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this card?')) return;
    try {
      await deleteCard(cardId);
      removeCardFromList(listId, cardId);
      onClose();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  if (!currentCard) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Loading..." size="lg">
        <div className="flex items-center justify-center py-8">
          <Loader size="md" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Card' : currentCard.title}
      size="lg"
    >
      <div className="space-y-6">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              label="Card Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Add a description..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <>
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {currentCard.description || 'No description provided.'}
              </p>
            </div>

            {/* Creator */}
            {currentCard.createdBy && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Created By</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center text-white text-sm font-semibold">
                    {currentCard.createdBy.name?.substring(0, 1).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{currentCard.createdBy.name}</span>
                </div>
              </div>
            )}

            {/* Assignees */}
            {currentCard.assignees && currentCard.assignees.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Assignees</h3>
                <div className="flex flex-wrap gap-2">
                  {currentCard.assignees.map((assignee) => (
                    <div key={assignee._id} className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center text-white text-xs font-semibold">
                        {assignee.name?.substring(0, 1).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700">{assignee.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Labels */}
            {currentCard.labels && currentCard.labels.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {currentCard.labels.map((label, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: label.color }}
                    >
                      {label.text}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Due Date */}
            {currentCard.dueDate && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Due Date</h3>
                <p className="text-gray-600">
                  {new Date(currentCard.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="border-t pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Card
              </Button>
              <Button variant="ghost" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
                <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Card
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CardDetailModal;
