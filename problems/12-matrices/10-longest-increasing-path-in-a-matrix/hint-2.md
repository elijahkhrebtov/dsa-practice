# Hint 2

`best(cell) = 1 + max(best(n))` over neighbours `n` with a larger value (or just `1` if there are none). Cache each answer — **memoization** — and every cell is solved exactly once: O(m·n).

Another way to see it: draw an arrow from each cell to its larger neighbours. The arrows form a DAG, and you want its longest path — a job for a **topological order**.

Watch out in JavaScript: a recursive memoized DFS can be ~20,000 calls deep on a long snake-shaped path and overflow the stack. Look for an order of processing cells that needs no recursion.
