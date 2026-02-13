/**
 * Client-side search utility for Signals, Blueprints, and AI content
 */

import type { SignalMeta } from './signals';

export interface SearchableItem {
  title: string;
  summary?: string;
  content?: string;
  tags?: string[];
  slug: string;
  date?: string;
}

export interface SearchResult {
  item: SearchableItem;
  score: number;
  matches: string[];
}

/**
 * Simple text search with scoring
 */
export function searchItems(
  items: SearchableItem[],
  query: string,
  options: { limit?: number; minScore?: number } = {}
): SearchResult[] {
  const { limit = 50, minScore = 0.1 } = options;
  
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);

  const results: SearchResult[] = items.map(item => {
    const searchableText = [
      item.title,
      item.summary,
      item.content,
      ...(item.tags || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    let score = 0;
    const matches: string[] = [];

    queryTerms.forEach(term => {
      // Exact title match gets highest score
      if (item.title.toLowerCase().includes(term)) {
        score += 10;
        matches.push(`title:${term}`);
      }

      // Summary match
      if (item.summary?.toLowerCase().includes(term)) {
        score += 5;
        matches.push(`summary:${term}`);
      }

      // Tag match
      if (item.tags?.some(tag => tag.toLowerCase().includes(term))) {
        score += 8;
        matches.push(`tag:${term}`);
      }

      // Content match (lower weight)
      if (item.content?.toLowerCase().includes(term)) {
        score += 1;
        matches.push(`content:${term}`);
      }

      // Word boundary matches get bonus
      const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, 'i');
      if (wordBoundaryRegex.test(searchableText)) {
        score += 2;
      }
    });

    return { item, score, matches };
  });

  // Filter by minimum score and sort
  return results
    .filter(result => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}


