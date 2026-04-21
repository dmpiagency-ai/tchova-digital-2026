// ============================================
// useGSMTools - Custom Hook
// Carrega e filtra ferramentas GSM com estados
// loading / error / success + paginação + debounce
// ============================================

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GSMTool } from '@/types/gsm';
import { gsmApiService, ToolsFilterParams, PaginatedResult, LoadingState } from '@/services/gsm/gsmApiService';

// ============================================
// TYPES
// ============================================

export interface UseGSMToolsOptions {
  initialCategory?: string;
  initialSearch?: string;
  autoLoad?: boolean;
  debounceMs?: number;
}

export interface UseGSMToolsReturn {
  tools: GSMTool[];
  total: number;
  status: LoadingState;
  error: string | null;
  isLoading: boolean;
  isEmpty: boolean;

  // Filters
  search: string;
  category: string;
  setSearch: (q: string) => void;
  setCategory: (cat: string) => void;

  // Actions
  refresh: () => void;
  loadMore: () => void;
  hasMore: boolean;

  // Computed
  availableOnly: boolean;
  setAvailableOnly: (v: boolean) => void;
  popularTools: GSMTool[];
}

// ============================================
// HOOK
// ============================================

export const useGSMTools = (options: UseGSMToolsOptions = {}): UseGSMToolsReturn => {
  const {
    initialCategory = 'all',
    initialSearch = '',
    autoLoad = true,
    debounceMs = 350,
  } = options;

  const [tools, setTools] = useState<GSMTool[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const [search, setSearchRaw] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [availableOnly, setAvailableOnly] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  const setSearch = useCallback((q: string) => {
    setSearchRaw(q);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(q);
      setPage(1);
    }, debounceMs);
  }, [debounceMs]);

  const fetchTools = useCallback(
    async (pageNum: number, append = false) => {
      setStatus('loading');
      setError(null);
      try {
        const filters: ToolsFilterParams = {
          page: pageNum,
          perPage: 12,
          ...(category !== 'all' && { category }),
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(availableOnly && { available: true }),
        };

        const result: PaginatedResult<GSMTool> = await gsmApiService.getTools(filters);
        setTools((prev) => append ? [...prev, ...result.items] : result.items);
        setTotal(result.total);
        setHasMore(result.hasMore);
        setStatus('success');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao carregar ferramentas';
        setError(msg);
        setStatus('error');
      }
    },
    [category, debouncedSearch, availableOnly]
  );

  // Initial/filter load
  useEffect(() => {
    if (!autoLoad) return;
    setPage(1);
    fetchTools(1, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, debouncedSearch, availableOnly]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchTools(1, false);
  }, [fetchTools]);

  const loadMore = useCallback(() => {
    if (!hasMore || status === 'loading') return;
    const next = page + 1;
    setPage(next);
    fetchTools(next, true);
  }, [hasMore, page, status, fetchTools]);

  // Category change resets page
  const handleSetCategory = useCallback((cat: string) => {
    setCategory(cat);
    setPage(1);
  }, []);

  // Computed
  const popularTools = useMemo(() => tools.filter((t) => t.popular), [tools]);

  const isLoading = status === 'loading';
  const isEmpty = status === 'success' && tools.length === 0;

  return {
    tools,
    total,
    status,
    error,
    isLoading,
    isEmpty,
    search,
    category,
    setSearch,
    setCategory: handleSetCategory,
    refresh,
    loadMore,
    hasMore,
    availableOnly,
    setAvailableOnly,
    popularTools,
  };
};

export default useGSMTools;
