# Hint 3

Sort the candidates first. In `dfs(start, remaining)`:

- If `remaining === 0`, record a **copy** of the path.
- Otherwise loop `i` from `start`: if `candidates[i] > remaining`, **stop the loop** — every later candidate is even bigger. Else push it, call `dfs(i, remaining - candidates[i])`, and pop it.

That `break` is the pruning that keeps the search close to the size of the answer.
