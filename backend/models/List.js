import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'List title is required'], trim: true, maxlength: 100 },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    order: { type: Number, required: true },
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

listSchema.index({ board: 1, order: 1 });

const List = mongoose.model('List', listSchema);
export default List;