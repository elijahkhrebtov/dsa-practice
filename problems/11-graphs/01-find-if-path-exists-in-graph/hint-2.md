# Hint 2

Build an adjacency list (`adj[u]` = array of neighbours, add each edge in both directions), then explore from `source` with BFS or DFS and a `visited` array, returning `true` the moment you reach `destination`.

Use an explicit queue or stack rather than recursion: one test has a path 200,000 vertices long, and a recursive DFS would need 200,000 nested calls — far more than JavaScript's call stack allows. (Union-find, where you merge the endpoints of every edge and compare roots, also works.)
