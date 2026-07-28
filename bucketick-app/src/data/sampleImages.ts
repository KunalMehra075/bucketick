/**
 * Curated placeholder images for the dummy "add photo" picker. Stored as URLs so
 * the backend-wired feed shows them across devices. Real gallery upload
 * (expo-image-picker + object storage) is the production follow-up.
 */
export interface SampleImage {
  url: string;
  aspect: number; // height / width, for the explore masonry layout
}

const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=60`;

export const SAMPLE_IMAGES: SampleImage[] = [
  { url: U('photo-1506905925346-21bda4d32df4'), aspect: 0.7 },
  { url: U('photo-1441974231531-c6227db76b6e'), aspect: 1.3 },
  { url: U('photo-1470071459604-3b5ec3a7fe05'), aspect: 0.66 },
  { url: U('photo-1507525428034-b723cf961d3e'), aspect: 0.67 },
  { url: U('photo-1519681393784-d120267933ba'), aspect: 1.5 },
  { url: U('photo-1500530855697-b586d89ba3ee'), aspect: 0.75 },
  { url: U('photo-1504674900247-0877df9cc836'), aspect: 0.8 },
  { url: U('photo-1526772662000-3f88f10405ff'), aspect: 1.25 },
  { url: U('photo-1517842645767-c639042777db'), aspect: 0.7 },
  { url: U('photo-1522202176988-66273c2fd55f'), aspect: 0.66 },
  { url: U('photo-1476514525535-07fb3b4ae5f1'), aspect: 1.4 },
  { url: U('photo-1533105079780-92b9be482077'), aspect: 0.75 },
];

export function aspectFor(url: string): number {
  return SAMPLE_IMAGES.find((s) => s.url === url)?.aspect ?? 1;
}
