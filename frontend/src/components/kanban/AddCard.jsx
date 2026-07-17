import React, { useState } from 'react';
import useListStore from '../../store/useListStore';
import useCardStore from '../../store/useCardStore';
import Button from '../common/Button';

const AddCard = ({ listId, boardId }) => {
  const { addCardToList } = useListStore();
  const { createCard } = useCardStore();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const card = await createCard({ title, listId, boardId });
      addCardToList(listId, card);
      setTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter card title..."
        autoFocus
        disabled={isSubmitting}
        rows={3}
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
      />
      <div className="flex space-x-2">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={isSubmitting}
          disabled={!title.trim()}
        >
          Add
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddCard;
