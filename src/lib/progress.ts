import { supabase } from './supabase';

/**
 * Sync layer between localStorage (fast, primary for running session)
 * and Supabase (cloud, source of truth across devices).
 *
 * Strategy:
 *  - localStorage keys stay the source for pages that already use them.
 *  - On auth, we pull cloud state and merge with local (union for sets,
 *    max for counters, cloud-wins for attempt history).
 *  - After auth, every localStorage.setItem to an az_* key is intercepted
 *    and pushed to cloud (debounced).
 */

const LS_KEYS = {
  xp: 'az_xp',
  completed: 'az_completed',
  streak: 'az_streak',
  mastered: 'az_mastered',
  quizHistory: 'az_quiz_history',
} as const;

const IMPORT_PROMPTED_KEY = 'az_import_prompted';

export interface LocalProgress {
  xp: number;
  completed: string[];
  streak: number;
  mastered: string[];
  quizHistory: Record<string, boolean>;
}

const EMPTY: LocalProgress = {
  xp: 0,
  completed: [],
  streak: 0,
  mastered: [],
  quizHistory: {},
};

export function readLocal(): LocalProgress {
  try {
    return {
      xp: Number(localStorage.getItem(LS_KEYS.xp) || '0'),
      completed: JSON.parse(localStorage.getItem(LS_KEYS.completed) || '[]'),
      streak: Number(localStorage.getItem(LS_KEYS.streak) || '0'),
      mastered: JSON.parse(localStorage.getItem(LS_KEYS.mastered) || '[]'),
      quizHistory: JSON.parse(localStorage.getItem(LS_KEYS.quizHistory) || '{}'),
    };
  } catch {
    return { ...EMPTY };
  }
}

function writeLocal(p: LocalProgress) {
  localStorage.setItem(LS_KEYS.xp, String(p.xp));
  localStorage.setItem(LS_KEYS.completed, JSON.stringify(p.completed));
  localStorage.setItem(LS_KEYS.streak, String(p.streak));
  localStorage.setItem(LS_KEYS.mastered, JSON.stringify(p.mastered));
  localStorage.setItem(LS_KEYS.quizHistory, JSON.stringify(p.quizHistory));
  // Tell any active page (XP bars etc.) to re-read.
  window.dispatchEvent(new Event('xp-updated'));
}

export function hasAnyLocalProgress(): boolean {
  const p = readLocal();
  return p.xp > 0
    || p.completed.length > 0
    || p.streak > 0
    || p.mastered.length > 0
    || Object.keys(p.quizHistory).length > 0;
}

export function wasImportPrompted(): boolean {
  return localStorage.getItem(IMPORT_PROMPTED_KEY) === 'true';
}

export function markImportPrompted() {
  localStorage.setItem(IMPORT_PROMPTED_KEY, 'true');
}

/** Derive the scenario short code (s1..s6) from a question id like "s3-q07". */
function scenarioFromQuestionId(qid: string): string {
  const m = qid.match(/^(s\d+)/i);
  return m ? m[1].toLowerCase() : 'unknown';
}

export async function pullCloud(userId: string): Promise<LocalProgress | null> {
  const [statsRes, lessonsRes, masteryRes, attemptsRes] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('lesson_progress').select('lesson_id').eq('user_id', userId),
    supabase.from('flashcard_mastery').select('card_id').eq('user_id', userId),
    supabase.from('quiz_attempts').select('question_id, correct, attempted_at').eq('user_id', userId).order('attempted_at', { ascending: true }),
  ]);

  if (statsRes.error && statsRes.error.code !== 'PGRST116') {
    console.warn('[progress] pullCloud stats error', statsRes.error.message);
    return null;
  }

  const stats = statsRes.data;
  if (!stats) return null;

  const quizHistory: Record<string, boolean> = {};
  for (const row of attemptsRes.data ?? []) {
    // Latest attempt wins (we ordered ascending so iterating overwrites).
    quizHistory[row.question_id] = row.correct;
  }

  return {
    xp: stats.total_xp ?? 0,
    streak: stats.streak_days ?? 0,
    completed: (lessonsRes.data ?? []).map(r => r.lesson_id),
    mastered: (masteryRes.data ?? []).map(r => r.card_id),
    quizHistory,
  };
}

export function hasAnyCloudProgress(c: LocalProgress | null): boolean {
  if (!c) return false;
  return c.xp > 0
    || c.completed.length > 0
    || c.mastered.length > 0
    || Object.keys(c.quizHistory).length > 0;
}

function mergeProgress(a: LocalProgress, b: LocalProgress): LocalProgress {
  return {
    xp: Math.max(a.xp, b.xp),
    streak: Math.max(a.streak, b.streak),
    completed: Array.from(new Set([...a.completed, ...b.completed])),
    mastered: Array.from(new Set([...a.mastered, ...b.mastered])),
    // Cloud (b) wins for quiz history when both have the same key — it represents
    // the most-recent attempt outcome from any device.
    quizHistory: { ...a.quizHistory, ...b.quizHistory },
  };
}

/**
 * Push the current localStorage progress to cloud. Idempotent — uses upserts
 * and ON CONFLICT DO NOTHING semantics so re-runs are safe.
 */
export async function pushLocal(userId: string): Promise<void> {
  const local = readLocal();

  // user_stats — upsert single row.
  await supabase.from('user_stats').upsert({
    user_id: userId,
    total_xp: local.xp,
    lessons_completed: local.completed.length,
    flashcards_mastered: local.mastered.length,
    quiz_correct: Object.values(local.quizHistory).filter(Boolean).length,
    quiz_total: Object.keys(local.quizHistory).length,
    streak_days: local.streak,
    last_active_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });

  // lesson_progress — bulk insert, ignore conflicts (composite PK).
  if (local.completed.length > 0) {
    const rows = local.completed.map(lesson_id => ({ user_id: userId, lesson_id }));
    await supabase.from('lesson_progress').upsert(rows, { onConflict: 'user_id,lesson_id', ignoreDuplicates: true });
  }

  // flashcard_mastery — bulk insert.
  if (local.mastered.length > 0) {
    const rows = local.mastered.map(card_id => ({ user_id: userId, card_id }));
    await supabase.from('flashcard_mastery').upsert(rows, { onConflict: 'user_id,card_id', ignoreDuplicates: true });
  }

  // quiz_attempts — only for entries that don't already exist in cloud.
  // We fetch existing question_ids then insert the missing ones.
  const qIds = Object.keys(local.quizHistory);
  if (qIds.length > 0) {
    const existing = await supabase.from('quiz_attempts').select('question_id').eq('user_id', userId).in('question_id', qIds);
    const existingSet = new Set((existing.data ?? []).map(r => r.question_id));
    const newAttempts = qIds
      .filter(qid => !existingSet.has(qid))
      .map(qid => ({
        user_id: userId,
        question_id: qid,
        scenario: scenarioFromQuestionId(qid),
        correct: local.quizHistory[qid],
      }));
    if (newAttempts.length > 0) {
      await supabase.from('quiz_attempts').insert(newAttempts);
    }
  }
}

/**
 * On sign-in: decide whether to pull, merge, prompt, or no-op.
 * Returns whether the import prompt should be shown.
 */
export async function reconcileOnSignIn(userId: string): Promise<{ promptImport: boolean }> {
  const local = readLocal();
  const cloud = await pullCloud(userId);

  const localHas = hasAnyLocalProgress();
  const cloudHas = hasAnyCloudProgress(cloud);

  if (!cloud) {
    // pullCloud failed — abort silently, leave local alone.
    return { promptImport: false };
  }

  // Case 1: nothing anywhere → nothing to do.
  if (!localHas && !cloudHas) return { promptImport: false };

  // Case 2: cloud has data, local is empty → pull cloud to local (cross-device load).
  if (!localHas && cloudHas) {
    writeLocal(cloud);
    return { promptImport: false };
  }

  // Case 3: cloud is empty, local has data → ask before pushing.
  if (localHas && !cloudHas) {
    if (wasImportPrompted()) return { promptImport: false };
    return { promptImport: true };
  }

  // Case 4: both have data → merge, write back to both.
  const merged = mergeProgress(local, cloud);
  writeLocal(merged);
  // Fire-and-forget push of merged state.
  pushLocal(userId).catch((e) => console.warn('[progress] merge push failed', e));
  return { promptImport: false };
}

/**
 * Monkey-patch localStorage.setItem so any write to an az_* key triggers
 * a debounced push to cloud. Idempotent — installs once per session.
 */
const SYNC_KEYS = new Set<string>([
  LS_KEYS.xp,
  LS_KEYS.completed,
  LS_KEYS.streak,
  LS_KEYS.mastered,
  LS_KEYS.quizHistory,
]);

declare global {
  interface Window {
    __azSyncInstalled?: boolean;
    __azSyncUserId?: string | null;
    __azSyncTimer?: number;
  }
}

export function installAutoSync(userId: string) {
  if (typeof window === 'undefined') return;
  window.__azSyncUserId = userId;

  if (window.__azSyncInstalled) return;
  window.__azSyncInstalled = true;

  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key: string, value: string) {
    originalSetItem.call(this, key, value);
    if (this === window.localStorage && SYNC_KEYS.has(key) && window.__azSyncUserId) {
      schedulePush();
    }
  };

  // Flush pending writes when the user navigates away.
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && window.__azSyncUserId) {
      flushPush(window.__azSyncUserId);
    }
  });
}

function schedulePush() {
  if (window.__azSyncTimer) window.clearTimeout(window.__azSyncTimer);
  window.__azSyncTimer = window.setTimeout(() => {
    const uid = window.__azSyncUserId;
    if (uid) flushPush(uid);
  }, 1500);
}

function flushPush(userId: string) {
  pushLocal(userId).catch((e) => console.warn('[progress] auto-sync push failed', e));
}

/** Called when a user opts to start fresh — clears local progress. */
export function clearLocal() {
  localStorage.removeItem(LS_KEYS.xp);
  localStorage.removeItem(LS_KEYS.completed);
  localStorage.removeItem(LS_KEYS.streak);
  localStorage.removeItem(LS_KEYS.mastered);
  localStorage.removeItem(LS_KEYS.quizHistory);
  window.dispatchEvent(new Event('xp-updated'));
}
