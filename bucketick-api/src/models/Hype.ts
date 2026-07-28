import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

/** The "like" edge: one hype per (user, post). */
const hypeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  },
  { timestamps: true }
);

hypeSchema.index({ user: 1, post: 1 }, { unique: true });

export type HypeDoc = HydratedDocument<InferSchemaType<typeof hypeSchema>>;
export const Hype = model('Hype', hypeSchema);
