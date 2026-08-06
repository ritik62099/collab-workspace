import mongoose from 'mongoose';




const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Workspace name is required'], trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' },
      joinedAt: { type: Date, default: Date.now }
    }],
    inviteCode: { type: String, unique: true, sparse: true },
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

workspaceSchema.methods.generateInviteCode = function () {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  this.inviteCode = code;
  return code;
};

const Workspace = mongoose.model('Workspace', workspaceSchema);
export default Workspace;