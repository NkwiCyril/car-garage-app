export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ParsedPage<T> {
  items: T[];
  meta: PageMeta;
}

export function parsePage<T>(response: any, requestedPage: number, requestedLimit: number): ParsedPage<T> {
  const items: T[] = extractItems<T>(response);
  const metaSource = response?.pagination ?? response?.meta ?? response ?? {};

  const page = numOr(metaSource.page ?? metaSource.currentPage, requestedPage);
  const limit = numOr(metaSource.limit ?? metaSource.perPage ?? metaSource.pageSize, requestedLimit);
  const total = numOr(metaSource.total ?? metaSource.totalCount ?? metaSource.totalItems, NaN);
  const totalPagesRaw = numOr(metaSource.totalPages ?? metaSource.pageCount, NaN);

  const totalPages = Number.isFinite(totalPagesRaw)
    ? totalPagesRaw
    : Number.isFinite(total) && limit > 0
      ? Math.max(1, Math.ceil(total / limit))
      : page + (items.length === limit ? 1 : 0);

  const hasMoreFlag =
    metaSource.hasMore ??
    metaSource.hasNextPage ??
    metaSource.next ??
    null;

  const hasMore =
    typeof hasMoreFlag === 'boolean'
      ? hasMoreFlag
      : Number.isFinite(totalPagesRaw) || Number.isFinite(total)
        ? page < totalPages
        : items.length >= limit;

  return {
    items,
    meta: {
      page,
      limit,
      total: Number.isFinite(total) ? total : items.length,
      totalPages,
      hasMore,
    },
  };
}

function extractItems<T>(response: any): T[] {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.cars)) return response.cars;
  return [];
}

function numOr(value: any, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
