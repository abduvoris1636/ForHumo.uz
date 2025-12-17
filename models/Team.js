import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Team name must be at least 3 characters'],
    maxlength: [50, 'Team name cannot exceed 50 characters']
  },
  captainName: {
    type: String,
    required: [true, 'Captain name is required'],
    trim: true,
    minlength: [2, 'Captain name must be at least 2 characters'],
    maxlength: [100, 'Captain name cannot exceed 100 characters']
  },
  mlbbId: {
    type: String,
    required: [true, 'MLBB ID is required'],
    trim: true,
    minlength: [3, 'MLBB ID must be at least 3 characters'],
    maxlength: [50, 'MLBB ID cannot exceed 50 characters']
  },
  telegramUsername: {
    type: String,
    required: [true, 'Telegram username is required'],
    trim: true,
    minlength: [3, 'Telegram username must be at least 3 characters'],
    maxlength: [50, 'Telegram username cannot exceed 50 characters']
  },
  teamLogo: {
    type: String,
    required: [true, 'Team logo is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  cloudinaryPublicId: {
    type: String
  }
});

// Index for faster queries
TeamSchema.index({ teamName: 1 }, { unique: true });
TeamSchema.index({ status: 1 });
TeamSchema.index({ registeredAt: -1 });

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
