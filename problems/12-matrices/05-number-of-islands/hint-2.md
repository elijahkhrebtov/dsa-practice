# Hint 2

This is **counting connected components**. Scan all cells. Each time you hit a `'1'` that hasn't been visited, increase the count and run a DFS or BFS from it that marks every land cell of that island as visited.

You're allowed to modify the grid, so marking can be as simple as turning `'1'` into `'0'` ("sinking" the island).
