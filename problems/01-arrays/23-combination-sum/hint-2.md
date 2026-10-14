# Hint 2

Use **backtracking** that only ever picks candidates at the same index or later: `dfs(start, remaining)` tries `candidates[i]` for `i >= start`, and recurses with `start = i` (not `i + 1` — the same value may be reused).

Because you never go back to an earlier candidate, each combination is built in one fixed order only.
