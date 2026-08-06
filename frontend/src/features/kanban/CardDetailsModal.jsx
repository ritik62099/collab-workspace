import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../pages/hooks/useSocket';
import { useBoardStore } from '../../store/useBoardStore';
import { SOCKET_EVENTS } from '../../utils/socketEvents';
import { formatters } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';

const CardDetailsModal = ({ card, listId, boardId, onClose }) => {
  const { addComment } = useBoardStore();
  const { socket } = useSocket(boardId);
  
  const [commentText, setCommentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Real-time typing indicator logic
  const handleTyping = (e) => {
    setCommentText(e.target.value);
    
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit(SOCKET_EVENTS.TYPING_START, { boardId, cardId: card._id });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket) {
        socket.emit(SOCKET_EVENTS.TYPING_STOP, { boardId, cardId: card._id });
      }
    }, 1000);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment(card._id, commentText);
      
      // Emit socket event for real-time update
      if (socket) {
        socket.emit(SOCKET_EVENTS.COMMENT_ADDED, { boardId, cardId: card._id });
      }
      
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // Listen for other users typing
  useEffect(() => {
    if (!socket) return;
    
    const handleUserTyping = (data) => {
      if (data.cardId === card._id && data.isTyping) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000); // Hide after 2s
      }
    };

    socket.on(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
    return () => socket.off(SOCKET_EVENTS.USER_TYPING, handleUserTyping);
  }, [socket, card._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <span className="text-sm font-medium">Card Details</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Card Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{card.title}</h2>
            <p className="text-sm text-gray-500">in list <span className="font-medium text-gray-700">{card.list?.title || 'Unknown List'}</span></p>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Comments
            </h3>

            {/* Existing Comments */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {card.comments && card.comments.length > 0 ? (
                card.comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-3 animate-fade-in">
                    <Avatar alt={comment.author?.name || 'User'} src={comment.author?.avatar} size="sm" />
                    <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-800">{comment.author?.name || 'Unknown'}</span>
                        <span className="text-xs text-gray-400">{formatters.formatRelativeTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">No comments yet. Be the first to comment!</p>
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="relative">
              <Input
                value={commentText}
                onChange={handleTyping}
                placeholder="Write a comment..."
                className="pr-20"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 -translate-y-1/2"
                disabled={!commentText.trim()}
              >
                Send
              </Button>
              {isTyping && (
                <p className="text-xs text-primary-600 mt-1 animate-pulse">Someone is typing...</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;