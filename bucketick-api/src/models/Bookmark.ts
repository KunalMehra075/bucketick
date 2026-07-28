import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

/** A saved post: one bookmark per (user, post). */
const bookmarkSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });
bookmarkSchema.index({ user: 1, createdAt: -1, _id: -1 });

export type BookmarkDoc = HydratedDocument<InferSchemaType<typeof bookmarkSchema>>;
export const Bookmark = model('Bookmark', bookmarkSchema);
