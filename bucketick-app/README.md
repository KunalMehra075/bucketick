# Bucketick (mobile MVP)

A colorful React Native app for collecting dreams, chasing them together, and
ticking them off. Standalone Expo project. Talks to the `bucketick-api` backend
(MongoDB) for real auth, lists, leaderboard, and follows.

## Stack

- Expo (SDK 57) + React Native + TypeScript
- React Navigation (native-stack + bottom-tabs) with a custom gradient tab bar
- Zustand for state, AsyncStorage for JWT token + onboarding persistence
- A small typed API client in `src/api` (fetch, `{ data }` unwrap, 401 auto-refresh)
- lucide-react-native + react-native-svg for icons (no emojis anywhere)
- expo-linear-gradient for the brand gradients
- Nunito + Manrope via @expo-google-fonts (the brand's exact fonts)

## What works

- Onboarding carousel (three colorful slides)
- Real login / signup / logout against the API (JWT, tokens stored on device)
- Create, edit, and delete bucket lists (title, description, category, color, visibility)
- Add, edit, complete, and delete dreams inside a list, with live progress
- Leaderboard with a top-three podium and your live rank (real users + points)
- Profile with real stats, Followers / Following / Discover tabs, and live follow toggles

The domain types in `src/types.ts` match the API responses exactly
(`bucketick-api/src/utils/serialize.ts`).

## Run it

First start the backend (see `../bucketick-api/README.md`), then:

```bash
cd bucketick-app
npm install                       # if you have not already
cp .env.example .env              # set EXPO_PUBLIC_API_URL for your setup
npx expo start                    # press i (iOS), a (Android), or scan the QR
```

Backend URL by platform (set `EXPO_PUBLIC_API_URL` in `.env`):

- iOS simulator: `http://localhost:8090` (the default)
- Android emulator: `http://10.0.2.2:8090`
- Physical device in Expo Go: `http://<your-computer-LAN-IP>:8090`

First launch shows onboarding, then login. Create an account, or use a seeded
demo account (`maya@bucketick.com` / `password`) if you ran `npm run seed` in the
backend.

## Project shape

```
src/
  api/          client (fetch + tokens + refresh) and typed endpoints
  theme/        design tokens, type scale
  components/   Button, Card, Chip, Avatar, Field, ProgressBar, Screen, ...
  store/        authStore, listsStore (Zustand, API-backed)
  data/         category options for the list form
  navigation/   Root + Tab navigators, custom TabBar
  screens/      Onboarding, auth/, home/, Leaderboard, Profile, EditProfile
```
