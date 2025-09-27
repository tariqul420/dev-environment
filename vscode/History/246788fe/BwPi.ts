import { IUser } from '@/types/user';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true },
    name: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },
    profile: { type: String },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

// Add indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

const User = mongoose.models?.User || mongoose.model<IUser>('User', userSchema);

export default User;
