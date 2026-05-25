import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

const REDIRECT_KEY = 'az_redirect_after_auth';
const SIGN_IN_URL = '/architect-zero/auth/sign-in';
const HOME_URL = '/architect-zero/';

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    window.location.href = HOME_URL;
  }
}

export function rememberIntendedUrl(url: string): void {
  if (typeof window === 'undefined') return;
  if (url.includes('/auth/')) return;
  sessionStorage.setItem(REDIRECT_KEY, url);
}

export function consumeIntendedUrl(): string {
  if (typeof window === 'undefined') return HOME_URL;
  const stored = sessionStorage.getItem(REDIRECT_KEY);
  if (stored) sessionStorage.removeItem(REDIRECT_KEY);
  return stored && stored.startsWith('/architect-zero/') ? stored : HOME_URL;
}

export function getDisplayName(user: User | null): string {
  if (!user) return '';
  const meta = user.user_metadata ?? {};
  return (
    meta.display_name ||
    meta.full_name ||
    meta.name ||
    meta.user_name ||
    user.email?.split('@')[0] ||
    'Architect'
  );
}

export function getAvatarUrl(user: User | null): string | null {
  if (!user) return null;
  return user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;
}

export async function ensureProfile(userId: string): Promise<void> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  if (existing) return;
  await supabase.from('profiles').insert({ id: userId });
}

export const AUTH_ROUTES = {
  signIn: SIGN_IN_URL,
  signUp: '/architect-zero/auth/sign-up',
  callback: '/architect-zero/auth/callback',
  account: '/architect-zero/auth/account',
  forgotPassword: '/architect-zero/auth/forgot-password',
  resetPassword: '/architect-zero/auth/reset-password',
  home: HOME_URL,
} as const;
