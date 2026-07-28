import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';
import { BRAND_COLORS } from '../types';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    avatarColor: { type: String, enum: BRAND_COLORS, default: 'pink' },
    avatarUrl: { type: String, default: null },
    bio: { type: String, default: null },
    verified: { type: Boolean, default: false },

    // Denormalized counters, recomputed after mutations.
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    listsCount: { type: Number, default: 0 },
    completedCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ points: -1 });
// Name search for the account search endpoint (username is already indexed via unique).
userSchema.index({ name: 1 });

export type UserDoc = HydratedDocument<InferSchemaType<typeof userSchema>>;
export const User = model('User', userSchema);
