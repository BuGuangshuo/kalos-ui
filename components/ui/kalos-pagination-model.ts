export type KalosPaginationItem = number | "start-ellipsis" | "end-ellipsis";

function integer(value: number, fallback: number, min = 0) {
  return Number.isFinite(value) ? Math.max(min, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(value))) : fallback;
}

export function paginationItems(page: number, pageCount: number, siblings = 1): KalosPaginationItem[] {
  const nearby = Math.min(5, integer(siblings, 1));
  const slots = nearby * 2 + 5;
  if (pageCount <= slots) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const middleCount = nearby * 2 + 1;
  if (page <= nearby + 3) return [
    ...Array.from({ length: middleCount + 2 }, (_, index) => index + 1), "end-ellipsis", pageCount,
  ];
  if (page >= pageCount - nearby - 2) return [
    1, "start-ellipsis", ...Array.from({ length: middleCount + 2 }, (_, index) => pageCount - middleCount - 1 + index),
  ];
  return [1, "start-ellipsis", ...Array.from({ length: middleCount }, (_, index) => page - nearby + index), "end-ellipsis", pageCount];
}

export function paginationState({ page, pageSize = 20, total, pageCount, siblings = 1 }: {
  page: number;
  pageSize?: number;
  total?: number;
  pageCount?: number;
  siblings?: number;
}) {
  const size = integer(pageSize, 20, 1);
  const rows = total === undefined ? undefined : integer(total, 0);
  const count = rows === undefined ? integer(pageCount ?? 1, 1, 1) : Math.max(1, Math.ceil(rows / size));
  const current = Math.min(count, integer(page, 1, 1));
  return {
    page: current, pageSize: size, pageCount: count, total: rows,
    from: rows === 0 ? 0 : (current - 1) * size + 1,
    to: rows === undefined ? current * size : Math.min(current * size, rows),
    items: paginationItems(current, count, siblings),
  };
}

export function paginationPageForSize(state: ReturnType<typeof paginationState>, nextSize: number) {
  const size = integer(nextSize, state.pageSize, 1);
  const count = state.total === undefined ? state.pageCount : Math.max(1, Math.ceil(state.total / size));
  return Math.min(count, Math.floor((state.page - 1) * state.pageSize / size) + 1);
}

export function paginationSizes(sizes: number[], current: number) {
  return [...new Set([...sizes.filter(size => Number.isSafeInteger(size) && size > 0), current])].sort((a, b) => a - b);
}
