export const AVAILABLE_TAGS = ['cooking', 'traveling', 'outdoors'] as const;

export type Tag = typeof AVAILABLE_TAGS[number];

export const TAG_COLORS: Record<Tag, string> = {
  cooking: 'badge-success',
  traveling: 'badge-accent',
  outdoors: 'badge-neutral',
} as const; 