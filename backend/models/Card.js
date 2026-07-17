import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Card title is required'], trim: true, maxlength: 200 },
    description: { type: String, default: '' },
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    labels: [{ name: { type: String, required: true }, color: { type: String, required: true } }],
    dueDate: { type: Date },
    order: { type: Number, required: true },
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

cardSchema.index({ list: 1, order: 1 });

// Virtual for comments
cardSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'card',
  options: { sort: { createdAt: -1 } }
});

// Ensure virtuals are included in toJSON and toObject
cardSchema.set('toJSON', { virtuals: true });
cardSchema.set('toObject', { virtuals: true });

const Card = mongoose.model('Card', cardSchema);
export default Card;