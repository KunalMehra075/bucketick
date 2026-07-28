import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const followSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

// One follow edge per (follower, following) pair.
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export type FollowDoc = HydratedDocument<InferSchemaType<typeof followSchema>>;
export const Follow = model('Follow', followSchema);
