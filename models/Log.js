import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['team_registered', 'team_approved', 'team_deleted', 'admin_login', 'error']
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);
