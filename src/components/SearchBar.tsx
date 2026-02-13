import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchItems, debounce, type SearchableItem } from "../lib/search";
import { signals } from "../lib/signals";
import { cn } from "../lib/utils";

interface SearchBarProps {
  className?: string;
  onResultClick?: () => void;
}

export default function SearchBar({ className, onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof searchItems>>([]);
  const navigate = useNavigate();

  // Convert signals to searchable items
  const searchableItems: SearchableItem[] = useMemo(() => {
    return signals.map(signal => ({
      title: signal.title,
      summary: signal.summary,
      tags: signal.secondary,
      slug: signal.slug,
      date: signal.date
    }));
  }, []);

  // Debounced search function
  const performSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }
      const searchResults = searchItems(searchableItems, searchQuery, { limit: 10 });
      setResults(searchResults);
    }, 300),
    [searchableItems]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
    setIsOpen(value.length >= 2);
  };

  const handleResultClick = (slug: string) => {
    navigate(`/signals/${slug}`);
    setQuery("");
    setIsOpen(false);
    onResultClick?.();
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Search signals..."
          className="w-full pl-10 pr-10 py-2 bg-dark-card border border-dark-tertiary rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
          aria-label="Search signals"
          aria-expanded={isOpen}
          aria-controls="search-results"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-tertiary rounded-lg shadow-lift max-h-96 overflow-y-auto z-50"
          role="listbox"
        >
          {results.map((result) => (
            <button
              key={result.item.slug}
              onClick={() => handleResultClick(result.item.slug)}
              className="w-full text-left px-4 py-3 hover:bg-dark-tertiary transition-colors border-b border-dark-tertiary last:border-b-0"
              role="option"
            >
              <div className="font-medium text-primary mb-1">{result.item.title}</div>
              {result.item.summary && (
                <div className="text-sm text-secondary line-clamp-2">{result.item.summary}</div>
              )}
              {result.item.tags && result.item.tags.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {result.item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded border border-accent/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-tertiary rounded-lg shadow-lift p-4 text-center text-secondary">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}


