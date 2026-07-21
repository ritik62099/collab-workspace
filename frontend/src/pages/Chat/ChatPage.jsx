import React, { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../store/useAuthStore';
import { formatters } from '../../utils/formatters';
import Avatar from '../../components/common/Avatar';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const ChatPage = () => {
  const { user: currentUser } = useAuthStore();
  const { socket } = useSocket();
  const {
    conversations,
    selectedUser,
    messages,
    users,
    typingUsers,
    fetchConversations,
    fetchUsers,
    fetchMessages,
    sendMessage,
    setSelectedUser,
    addMessage,
    setTyping,
    clearMessages,
  } = useChatStore();

  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message) => {
        addMessage(message);
      });

      socket.on('user-typing', (data) => {
        if (selectedUser && data.senderId === selectedUser._id) {
          setTyping(selectedUser._id, data.isTyping);
        }
      });

      return () => {
        socket.off('receive-message');
        socket.off('user-typing');
      };
    }
  }, [socket, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    await fetchMessages(user._id);
    
    // Mark messages as read
    if (socket) {
      socket.emit('mark-read', {
        senderId: user._id,
        receiverId: currentUser._id,
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    try {
      await sendMessage(selectedUser._id, messageText);
      
      // Emit socket event
      if (socket) {
        socket.emit('send-message', {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
          content: messageText,
        });
      }

      setMessageText('');
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    
    if (!isTyping && socket && selectedUser) {
      setIsTyping(true);
      socket.emit('typing', {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket && selectedUser) {
        socket.emit('typing', {
          senderId: currentUser._id,
          receiverId: selectedUser._id,
          isTyping: false,
        });
      }
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-white">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
  {users.length === 0 ? (
    <div className="p-4 text-center text-gray-500">
      No users found. Register more users to chat!
    </div>
  ) : (
    users.map((user) => (
      <button
        key={user._id}
        onClick={() => handleSelectUser(user)}
        className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
          selectedUser?._id === user._id ? 'bg-blue-50' : ''
        }`}
      >
        <Avatar src={user.avatar} alt={user.name} size="md" />
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </button>
    ))
  )}
</div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-white">
              <Avatar src={selectedUser.avatar} alt={selectedUser.name} size="md" />
              <div>
                <h3 className="font-semibold text-gray-800">{selectedUser.name}</h3>
                {typingUsers[selectedUser._id] && (
                  <p className="text-sm text-green-600 animate-pulse">typing...</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => {
                const isOwnMessage = message.sender._id === currentUser._id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span
                        className={`text-xs mt-1 block ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {formatters.formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  value={messageText}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!messageText.trim()}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-medium">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;