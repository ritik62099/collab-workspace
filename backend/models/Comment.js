import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: [true, 'Comment text is required'], maxlength: 2000 },
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isEdited: { type: Boolean, default: false }
  },
  { timestamps: true }
);

commentSchema.index({ card: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;