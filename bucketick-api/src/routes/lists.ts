import { Router } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { List, ListDoc } from '../models/List';
import { Item } from '../models/Item';
import { requireAuth } from '../middleware/auth';
import { asyncHandler, badRequest, forbidden, notFound, ok } from '../utils/http';
import { serializeItem, serializeList } from '../utils/serialize';
import { countsByList, countsForList, recomputeUserStats } from '../utils/stats';
import { BRAND_COLORS, CATEGORIES, VISIBILITIES } from '../types';

export const listsRouter = Router();
listsRouter.use(requireAuth);

const createSchema = z.object({
  title: z.string().trim().min(2, 'Give your list a title').max(120),
  description: z.string().trim().max(500).nullish(),
  category: z.enum(CATEGORIES).optional(),
  accent: z.enum(BRAND_COLORS).optional(),
  visibility: z.enum(VISIBILITIES).optional(),
});

const updateSchema = createSchema.partial();

const createItemSchema = z.object({
  title: z.string().trim().min(1, 'What do you want to do?').max(160),
  note: z.string().trim().max(500).nullish(),
  location: z.string().trim().max(120).nullish(),
});

async function loadOwnedList(userId: string, id: string): Promise<ListDoc> {
  if (!Types.ObjectId.isValid(id)) throw badRequest('Invalid list id');
  const list = (await List.findById(id)) as ListDoc | null;
  if (!list) throw notFound('List not found');
  if (String(list.owner) !== userId) throw forbidden('This list is not yours');
  return list;
}

// GET /lists — my lists with counts.
listsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const lists = (await List.find({ owner: req.userId }).sort({ createdAt: -1 })) as ListDoc[];
    const counts = await countsByList(lists.map((l) => l._id as Types.ObjectId));
    ok(
      res,
      lists.map((l) =>
        serializeList(l, counts.get(String(l._id)) ?? { itemsCount: 0, completedCount: 0, inProgressCount: 0 })
      )
    );
  })
);

// POST /lists
listsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const list = (await List.create({
      owner: req.userId,
      title: body.title,
      description: body.description ?? null,
      category: body.category ?? 'Everyday',
      accent: body.accent ?? 'pink',
      visibility: body.visibility ?? 'public',
    })) as ListDoc;
    await recomputeUserStats(req.userId!);
    ok(res, serializeList(list, { itemsCount: 0, completedCount: 0, inProgressCount: 0 }), 201);
  })
);

// GET /lists/:id
listsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const list = await loadOwnedList(req.userId!, req.params.id);
    const counts = await countsForList(list._id as Types.ObjectId);
    ok(res, serializeList(list, counts));
  })
);

// PATCH /lists/:id
listsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const list = await loadOwnedList(req.userId!, req.params.id);
    const patch = updateSchema.parse(req.body);
    if (patch.title !== undefined) list.title = patch.title;
    if (patch.description !== undefined) list.description = patch.description ?? null;
    if (patch.category !== undefined) list.category = patch.category;
    if (patch.accent !== undefined) list.accent = patch.accent;
    if (patch.visibility !== undefined) list.visibility = patch.visibility;
    await list.save();
    const counts = await countsForList(list._id as Types.ObjectId);
    ok(res, serializeList(list, counts));
  })
);

// DELETE /lists/:id
listsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const list = await loadOwnedList(req.userId!, req.params.id);
    await Item.deleteMany({ list: list._id });
    await list.deleteOne();
    await recomputeUserStats(req.userId!);
    ok(res, null);
  })
);

// GET /lists/:id/items
listsRouter.get(
  '/:id/items',
  asyncHandler(async (req, res) => {
    const list = await loadOwnedList(req.userId!, req.params.id);
    const items = await Item.find({ list: list._id }).sort({ createdAt: 1 });
    ok(res, items.map(serializeItem));
  })
);

// POST /lists/:id/items
listsRouter.post(
  '/:id/items',
  asyncHandler(async (req, res) => {
    const list = await loadOwnedList(req.userId!, req.params.id);
    const body = createItemSchema.parse(req.body);
    const item = await Item.create({
      list: list._id,
      owner: req.userId,
      title: body.title,
      note: body.note ?? null,
      location: body.location ?? null,
      status: 'dreaming',
    });
    // New items are "dreaming", so stats (completed/in_progress) are unchanged,
    // but recompute keeps things honest if that ever changes.
    ok(res, serializeItem(item), 201);
  })
);
