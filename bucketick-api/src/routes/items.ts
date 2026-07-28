import { Router } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { Item, ItemDoc } from '../models/Item';
import { requireAuth } from '../middleware/auth';
import { asyncHandler, badRequest, forbidden, notFound, ok } from '../utils/http';
import { serializeItem } from '../utils/serialize';
import { recomputeUserStats } from '../utils/stats';
import { ITEM_STATUSES } from '../types';

export const itemsRouter = Router();
itemsRouter.use(requireAuth);

const updateSchema = z
  .object({
    title: z.string().trim().min(1).max(160).optional(),
    note: z.string().trim().max(500).nullish(),
    location: z.string().trim().max(120).nullish(),
    status: z.enum(ITEM_STATUSES).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });

async function loadOwnedItem(userId: string, id: string): Promise<ItemDoc> {
  if (!Types.ObjectId.isValid(id)) throw badRequest('Invalid item id');
  const item = (await Item.findById(id)) as ItemDoc | null;
  if (!item) throw notFound('Item not found');
  if (String(item.owner) !== userId) throw forbidden('This item is not yours');
  return item;
}

// PATCH /items/:id — edit fields and/or status.
itemsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const item = await loadOwnedItem(req.userId!, req.params.id);
    const patch = updateSchema.parse(req.body);

    if (patch.title !== undefined) item.title = patch.title;
    if (patch.note !== undefined) item.note = patch.note ?? null;
    if (patch.location !== undefined) item.location = patch.location ?? null;

    let statusChanged = false;
    if (patch.status !== undefined && patch.status !== item.status) {
      item.status = patch.status;
      item.completedAt = patch.status === 'completed' ? new Date() : null;
      statusChanged = true;
    }

    await item.save();
    if (statusChanged) await recomputeUserStats(item.owner);
    ok(res, serializeItem(item));
  })
);

// DELETE /items/:id
itemsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const item = await loadOwnedItem(req.userId!, req.params.id);
    const wasCounted = item.status !== 'dreaming';
    await item.deleteOne();
    if (wasCounted) await recomputeUserStats(item.owner);
    ok(res, null);
  })
);
