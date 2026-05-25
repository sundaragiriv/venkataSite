import { atom, map, computed } from 'nanostores';
import { getCurrentLevel, getNextLevel, getProgressPct } from './domains';

// ── PERSIST HELPERS ──────────────────────────────────────
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`az_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`az_${key}`, JSON.stringify(value)); } catch {}
}

// ── XP & PROGRESS ────────────────────────────────────────
export const $xp = atom<number>(loadFromStorage('xp', 0));
export const $streak = atom<number>(loadFromStorage('streak', 0));
export const $completedLessons = atom<Set<string>>(
  new Set(loadFromStorage<string[]>('completed', []))
);
export const $masteredCards = atom<Set<string>>(
  new Set(loadFromStorage<string[]>('mastered', []))
);
export const $quizHistory = atom<Record<string, boolean>>(
  loadFromStorage('quiz_history', {})
);

// ── DERIVED ──────────────────────────────────────────────
export const $level = computed($xp, xp => getCurrentLevel(xp));
export const $nextLevel = computed($xp, xp => getNextLevel(xp));
export const $progressPct = computed($xp, xp => getProgressPct(xp));

// ── UI STATE ─────────────────────────────────────────────
export const $screen = atom<string>('home');
export const $showLevelUp = atom<boolean>(false);
export const $newLevelInfo = atom<{ title: string; color: string } | null>(null);

// ── TEACH-BACK ───────────────────────────────────────────
export const $tbMode = atom<'13' | 'arch' | 'cam'>('13');
export const $tbLesson = atom<string | null>(null);
export const $tbMessages = atom<{ role: 'user' | 'assistant'; content: string }[]>([]);
export const $tbLoading = atom<boolean>(false);
export const $tbRound = atom<number>(0);

// ── QUIZ STATE ───────────────────────────────────────────
export const $quizFilter = atom<string>('all');
export const $quizQuestions = atom<any[]>([]);
export const $quizIdx = atom<number>(0);
export const $quizSelected = atom<number | null>(null);
export const $quizScore = atom<number>(0);
export const $quizDone = atom<boolean>(false);

// ── FLASHCARD STATE ──────────────────────────────────────
export const $flashFilter = atom<string>('all');
export const $flashIdx = atom<number>(0);
export const $flashFlipped = atom<boolean>(false);

// ── ACTIONS ──────────────────────────────────────────────
export function earnXP(amount: number) {
  const prev = $xp.get();
  const prevLevel = getCurrentLevel(prev);
  const next = prev + amount;
  $xp.set(next);
  saveToStorage('xp', next);
  const newLevel = getCurrentLevel(next);
  if (newLevel.level > prevLevel.level) {
    $newLevelInfo.set({ title: newLevel.title, color: newLevel.color });
    $showLevelUp.set(true);
  }
}

export function completeLesson(lessonId: string, xpAmount: number) {
  const current = $completedLessons.get();
  if (current.has(lessonId)) return;
  const next = new Set([...current, lessonId]);
  $completedLessons.set(next);
  saveToStorage('completed', [...next]);
  earnXP(xpAmount);
}

export function masterCard(cardId: string) {
  const current = $masteredCards.get();
  if (current.has(cardId)) return;
  const next = new Set([...current, cardId]);
  $masteredCards.set(next);
  saveToStorage('mastered', [...next]);
  earnXP(8);
}

export function resetProgress() {
  $xp.set(0);
  $streak.set(0);
  $completedLessons.set(new Set());
  $masteredCards.set(new Set());
  $quizHistory.set({});
  ['xp','streak','completed','mastered','quiz_history'].forEach(k =>
    localStorage.removeItem(`az_${k}`)
  );
}
