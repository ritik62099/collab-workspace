import React, { useState } from 'react';
import useListStore from '../../store/useListStore';
import Button from '../common/Button';
import Input from '../common/Input';

const AddList = ({ boardId }) => {
  const { createList } = useListStore();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createList({ title, boardId });
      setTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating list:', error);
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
      <div className="flex-shrink-0 w-72">
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 rounded-lg p-3 text-white font-medium transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add List
        </button>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-72">
      <form onSubmit={handleSubmit} className="bg-gray-100 rounded-lg p-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          autoFocus
          disabled={isSubmitting}
        />
        <div className="flex space-x-2 mt-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSubmitting}
            disabled={!title.trim()}
          >
            Add List
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
    </div>
  );
};

export default AddList;
