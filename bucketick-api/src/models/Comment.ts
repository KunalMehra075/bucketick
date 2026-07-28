import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';

const commentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Paged newest-first per post via keyset pagination.
commentSchema.index({ post: 1, createdAt: -1, _id: -1 });

export type CommentDoc = HydratedDocument<InferSchemaType<typeof commentSchema>> & {
  post: Types.ObjectId;
  author: Types.ObjectId;
};
export const Comment = model('Comment', commentSchema);
