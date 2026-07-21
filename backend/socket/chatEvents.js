import Message from '../models/Message.js';

export const registerChatEvents = (io, socket) => {
  // Join user's personal chat room
  socket.on('join-chat', (userId) => {
    socket.join(`chat-${userId}`);
    console.log(`User ${userId} joined chat room`);
  });

  // Send direct message
  socket.on('send-message', async (data) => {
    try {
      const { senderId, receiverId, content } = data;

      // Save to database
      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name avatar email');

      // Emit to receiver
      io.to(`chat-${receiverId}`).emit('receive-message', populatedMessage);

      // Emit confirmation to sender
      socket.emit('message-sent', populatedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(`chat-${data.receiverId}`).emit('user-typing', {
      senderId: data.senderId,
      isTyping: data.isTyping,
    });
  });

  // Mark messages as read
  socket.on('mark-read', async (data) => {
    try {
      await Message.updateMany(
        {
          sender: data.senderId,
          receiver: data.receiverId,
          isRead: false,
        },
        {
          isRead: true,
          readAt: new Date(),
        }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });
};