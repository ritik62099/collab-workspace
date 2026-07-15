import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Board title is required'], trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500, default: '' },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    background: { type: String, default: '#0079BF' },
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

boardSchema.index({ workspace: 1, isArchived: 1 });

const Board = mongoose.model('Board', boardSchema);
export default Board;