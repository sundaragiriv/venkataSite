/**
 * Calculate reading time for content
 */

const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  return minutes;
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return 'Less than 1 min read';
  }
  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}


