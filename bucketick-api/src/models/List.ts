import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';
import { BRAND_COLORS, VISIBILITIES } from '../types';

const listSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    visibility: { type: String, enum: VISIBILITIES, default: 'public' },
    category: { type: String, default: 'Everyday' },
    accent: { type: String, enum: BRAND_COLORS, default: 'pink' },
    coverUrl: { type: String, default: null },
  },
  { timestamps: true }
);

export type ListDoc = HydratedDocument<InferSchemaType<typeof listSchema>> & {
  owner: Types.ObjectId;
};
export const List = model('List', listSchema);
