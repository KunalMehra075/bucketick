import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';
import { ITEM_STATUSES } from '../types';

const itemSchema = new Schema(
  {
    list: { type: Schema.Types.ObjectId, ref: 'List', required: true, index: true },
    // Denormalized owner so leaderboard/stats queries never need a join.
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    note: { type: String, default: null },
    status: { type: String, enum: ITEM_STATUSES, default: 'dreaming' },
    location: { type: String, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type ItemDoc = HydratedDocument<InferSchemaType<typeof itemSchema>> & {
  list: Types.ObjectId;
  owner: Types.ObjectId;
};
export const Item = model('Item', itemSchema);
