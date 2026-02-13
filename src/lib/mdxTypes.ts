/**
 * Type definitions for MDX modules
 */

import type { PostMeta } from './schema';

export interface MDXModule {
  default: React.ComponentType;
  frontmatter?: PostMeta;
  meta?: PostMeta;
}

export type MDXModules = Record<string, MDXModule>;


