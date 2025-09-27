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
    profilePicture: { type: String },
  },
  { timestamps: true },
);

// Add indexes
userSchema.index({ clerkUserId: 1 }, { unique: true }); // For Clerk user ID lookups
userSchema.index({ email: 1 }, { unique: true }); // For email lookups
userSchema.index({ slug: 1 }, { unique: true }); // For slug lookups
userSchema.index({ role: 1 }); // For role filtering
userSchema.index({ createdAt: -1 }); // For sorting by date
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' }); // For text search

const User = mongoose.models?.User || mongoose.model<IUser>('User', userSchema);

export default User;
