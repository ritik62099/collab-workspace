import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['card_assigned', 'card_mentioned', 'comment_added', 'workspace_invite', 'card_due', 'board_update'], required: true },
    message: { type: String, required: true },
    resource: { type: mongoose.Schema.Types.ObjectId, refPath: 'resourceType' },
    resourceType: { type: String, enum: ['Card', 'Board', 'Workspace', 'Comment'] },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date }
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;