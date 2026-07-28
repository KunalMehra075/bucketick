import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User';
import { asyncHandler, badRequest, ok, unauthorized } from '../utils/http';
import { issueTokens, verifyRefreshToken } from '../utils/tokens';
import { serializeUser } from '../utils/serialize';
import { makeUniqueUsername, pickAvatarColor } from '../utils/user';

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(60),
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters').max(200),
});

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1),
});

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = registerSchema.parse(req.body);

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw badRequest('An account with that email already exists', { field: 'email' });

    const passwordHash = await bcrypt.hash(password, 10);
    const username = await makeUniqueUsername(name || email.split('@')[0]);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      username,
      avatarColor: pickAvatarColor(name || email),
      avatarUrl: `https://i.pravatar.cc/300?u=${username}`,
      bio: 'Collecting dreams, one list at a time.',
    });

    const tokens = issueTokens(String(user._id));
    ok(res, { ...tokens, user: serializeUser(user) }, 201);
  })
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) throw unauthorized('No account found for that email');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw unauthorized('Incorrect password');

    const tokens = issueTokens(String(user._id));
    ok(res, { ...tokens, user: serializeUser(user) });
  })
);

authRouter.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refresh_token } = refreshSchema.parse(req.body);
    let userId: string;
    try {
      userId = verifyRefreshToken(refresh_token).sub;
    } catch {
      throw unauthorized('Invalid refresh token');
    }
    const user = await User.findById(userId);
    if (!user) throw unauthorized('Account no longer exists');
    ok(res, issueTokens(String(user._id)));
  })
);

authRouter.post(
  '/logout',
  asyncHandler(async (_req, res) => {
    // Stateless JWTs: nothing to revoke server-side in this MVP.
    ok(res, null);
  })
);
