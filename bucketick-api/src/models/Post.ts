import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';
import { CATEGORIES, VISIBILITIES } from '../types';

/** Optional link from a post back to the achievement (list/item) it celebrates. */
const achievementSchema = new Schema(
  {
    kind: { type: String, enum: ['list', 'item'], required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
  },
  { _id: false }
);

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caption: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    // height / width of the first image, drives the Explore masonry layout.
    coverAspect: { type: Number, default: 1 },
    achievement: { type: achievementSchema, default: null },
    category: { type: String, enum: CATEGORIES, default: 'Everyday' },
    visibility: { type: String, enum: VISIBILITIES, default: 'public' },

    // Denormalized counters, kept in sync with $inc on the edge collections.
    hypesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Feed and explore both page by (createdAt, _id) descending — keyset pagination.
postSchema.index({ createdAt: -1, _id: -1 });
postSchema.index({ author: 1, createdAt: -1, _id: -1 });
postSchema.index({ visibility: 1, createdAt: -1, _id: -1 });

export type PostDoc = HydratedDocument<InferSchemaType<typeof postSchema>> & {
  author: Types.ObjectId;
};
export const Post = model('Post', postSchema);
