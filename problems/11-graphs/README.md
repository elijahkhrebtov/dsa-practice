# Graphs

A **graph** is a set of **vertices** (nodes) joined by **edges**. Trees, linked lists, grids, road maps, course prerequisites, social networks and word puzzles are all graphs. Learn a handful of traversal and bookkeeping techniques and a whole family of problems becomes routine.

## Vocabulary

| Term | Meaning |
| --- | --- |
| Vertex / node | One item, usually labelled `0 … n-1` (or `1 … n`). |
| Edge | A connection between two vertices `u` and `v`. |
| Undirected | Edges work both ways: `u — v`. |
| Directed (digraph) | Edges have a direction: `u → v` does not imply `v → u`. |
| Weighted | Every edge carries a cost/length/time `w`. |
| Degree | Number of edges touching a vertex. In a digraph: **in-degree** (arrows in) and **out-degree** (arrows out). |
| Path | A sequence of vertices where consecutive ones are joined by edges. |
| Cycle | A path that starts and ends at the same vertex. A **self-loop** `u → u` is a cycle of length 1. |
| Connected component | A maximal group of vertices that can all reach each other (undirected). |
| DAG | Directed Acyclic Graph: directed, no cycles. Exactly the graphs that have a topological order. |
| Tree | A connected undirected graph with no cycles. It has exactly `n − 1` edges. |
| Dense / sparse | `E` close to `V²` vs. `E` close to `V`. Most interview graphs are sparse. |

`V` (or `n`) = number of vertices, `E` (or `m`) = number of edges.

## Representations in JavaScript

Problems usually hand you an **edge list** like `[[0, 1], [1, 2], …]`. That format is easy to store but useless for "who are the neighbours of `u`?", since you would scan every edge each time. **Your first step is almost always to build an adjacency list.**

### Edge list → adjacency list

```js
const adj = Array.from({ length: n }, () => []); // NOT new Array(n).fill([]) — that shares ONE array!
for (const [u, v] of edges) {
  adj[u].push(v);
  adj[v].push(u); // only for undirected graphs
}
```

For weighted graphs, store pairs: `adj[u].push([v, w])`. If the labels aren't `0 … n-1` (strings, sparse ids), use a `Map` from label → array.

### Adjacency matrix

```js
const matrix = Array.from({ length: n }, () => new Array(n).fill(0)); // or Infinity for "no edge" in weighted graphs
matrix[u][v] = 1; // or the weight
```

An adjacency matrix takes O(V²) memory, but it answers "is there an edge `u → v`?" in O(1). Use it for small, dense graphs (Floyd–Warshall, transitive closure, `n ≤ ~1000`).

### Implicit graphs

Sometimes the graph is never written down. In a grid, each cell is a vertex and its 4 neighbours are the edges. In Word Ladder, words are vertices and "differs by one letter" is an edge. You generate neighbours on the fly.

### Pointer-based nodes

Clone Graph hands you `GraphNode` objects (`lib/graph.js`) with a `neighbors` array, the same way linked lists and trees hand you nodes.

| | Adjacency list | Adjacency matrix | Edge list |
| --- | --- | --- | --- |
| Memory | O(V + E) | O(V²) | O(E) |
| Iterate neighbours of `u` | O(deg u) | O(V) | O(E) |
| Is `u — v` an edge? | O(deg u) | O(1) | O(E) |
| Best for | almost everything | small dense graphs | Kruskal, Bellman-Ford, union-find |

## Traversals

### Depth-first search (DFS)

Go as deep as possible, then backtrack. DFS is natural for reachability, connected components, cycle detection and topological sort.

```js
// Recursive: short, but recursion depth = length of the longest path explored
function dfs(u) {
  visited[u] = true;
  for (const v of adj[u]) if (!visited[v]) dfs(v);
}

// Iterative: explicit stack, no depth limit
const stack = [start];
visited[start] = true;
while (stack.length) {
  const u = stack.pop();
  for (const v of adj[u]) {
    if (!visited[v]) { visited[v] = true; stack.push(v); }
  }
}
```

**Recursion-depth caveat.** Node's default call stack holds roughly 10,000 simple frames, and fewer inside a test runner or with larger frames. A path or chain of 20,000+ vertices throws `RangeError: Maximum call stack size exceeded`. Recursive DFS is fine for small inputs and trees of logarithmic height. Whenever the constraints allow long paths (`n` up to 10⁵), use an explicit stack, BFS or union-find. Several tests in this topic are built to catch this.

### Breadth-first search (BFS)

Explore in rings: all vertices at distance 1, then distance 2, and so on. BFS gives **shortest paths in unweighted graphs** and level-by-level processing.

```js
const queue = [start];
const dist = new Array(n).fill(-1);
dist[start] = 0;
for (let head = 0; head < queue.length; head++) { // head index: O(1) dequeue
  const u = queue[head];
  for (const v of adj[u]) {
    if (dist[v] === -1) { dist[v] = dist[u] + 1; queue.push(v); }
  }
}
```

Don't use `queue.shift()`. It's O(n) per call in the worst case (see the Queues topic). A head index into a growing array is the simplest O(1) queue.

### Visited sets

Unlike trees, graphs have cycles and shared vertices, so **every traversal needs a visited structure**: a `boolean[]`/`Uint8Array` for integer labels, a `Set` for strings, or a `Map` when you also store data (Clone Graph's original → copy map). **Mark a vertex when you push it**, not when you pop it. Otherwise the same vertex can be queued many times.

## Topological sort

A **topological order** of a DAG lists the vertices so that every edge `u → v` has `u` before `v`. It exists **if and only if the graph has no directed cycle**, so the same algorithms double as cycle detectors.

**Kahn's algorithm (BFS on in-degrees).**
1. Compute `indegree[v]` for every vertex.
2. Queue all vertices with in-degree 0.
3. Pop `u`, append it to the order, and decrement the in-degree of each neighbour. Queue those that drop to 0.
4. If the order contains all `V` vertices, it's valid. Otherwise the leftover vertices sit on, or behind, a cycle.

**DFS with three colours.** WHITE = unvisited, GRAY = on the current DFS path, BLACK = finished.
- Reaching a GRAY vertex means you've looped back onto your own path, so there's a **cycle**.
- Reaching a BLACK vertex is fine (it was explored from elsewhere). A single boolean "visited" can't tell these two cases apart.
- Appending each vertex when it turns BLACK gives a **reverse** topological order.

Kahn's algorithm is iterative by nature. The DFS version needs an explicit stack for deep graphs.

## Union-find (disjoint set union)

Union-find tracks a partition of the vertices into groups and supports two operations:
- `find(x)`: the representative (root) of x's group.
- `union(a, b)`: merge the groups of a and b.

```js
const parent = Array.from({ length: n }, (_, i) => i);
const rank = new Array(n).fill(0);

function find(x) {                       // iterative, with path compression
  let root = x;
  while (parent[root] !== root) root = parent[root];
  while (parent[x] !== root) { const up = parent[x]; parent[x] = root; x = up; }
  return root;
}

function union(a, b) {                   // union by rank; returns false if already joined
  let ra = find(a), rb = find(b);
  if (ra === rb) return false;
  if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
  parent[rb] = ra;
  if (rank[ra] === rank[rb]) rank[ra]++;
  return true;
}
```

- **Path compression**: after a `find`, point every vertex on the route straight at the root.
- **Union by rank/size**: hang the shorter/smaller tree under the taller/larger one.
- With both, each operation costs O(α(n)), the inverse Ackermann function, which is at most 4 in practice. With **neither**, a star whose edges are `[0, i]` builds a chain of height n, and the whole run becomes O(n²).
- Use union-find for connectivity questions on **undirected** graphs where edges arrive over time: counting components, "does this edge close a cycle?", and Kruskal's MST. It does **not** detect cycles in directed graphs.

## Shortest paths

| Situation | Algorithm | Time |
| --- | --- | --- |
| Unweighted (every edge costs 1) | BFS | O(V + E) |
| Weights 0 or 1 | 0-1 BFS (deque) | O(V + E) |
| Non-negative weights | **Dijkstra** with a min-heap | O((V + E) log V) |
| Negative weights, or "at most k edges" | **Bellman-Ford** (relax all edges, up to V − 1 or k rounds) | O(V · E) or O(k · E) |
| All pairs, small V | Floyd–Warshall | O(V³) |

**Dijkstra.** Push `[0, source]` into a min-heap (`lib/priority-queue.js`). Repeatedly pop the closest unsettled vertex and relax its edges (`dist[v] = min(dist[v], dist[u] + w)`), pushing improved distances. When you pop a stale entry (`d > dist[u]`), skip it. Dijkstra breaks with negative edges, because a settled vertex could later get cheaper.

**Bellman-Ford.** Repeat V − 1 times: for every edge `u → v (w)`, relax. If a V-th round still improves something, there's a negative cycle. To limit a path to **at most k edges**, run exactly k rounds, each reading from a *copy* of the previous round's distances (Cheapest Flights Within K Stops).

## Minimum spanning tree (MST)

An MST connects all vertices of a weighted undirected graph with V − 1 edges of minimum total weight.

- **Kruskal**: sort the edges by weight and add each one unless it would close a cycle (checked with union-find). O(E log E). Best when you have an explicit edge list.
- **Prim**: grow the tree from one vertex, always adding the cheapest edge that leaves the tree, using a min-heap, or a plain O(V²) scan for dense/complete graphs. The O(V²) array version beats heaps on complete graphs such as "connect all points" problems.

## Complexity summary

| Task | Technique | Time | Space |
| --- | --- | --- | --- |
| Build adjacency list | loop over edges | O(V + E) | O(V + E) |
| Reachability / components | BFS, DFS | O(V + E) | O(V) |
| Components with edges arriving online | union-find | O(E · α(V)) | O(V) |
| Cycle detection (undirected) | DFS with parent / union-find | O(V + E) | O(V) |
| Cycle detection (directed), topological sort | Kahn / 3-colour DFS | O(V + E) | O(V + E) |
| Bipartite check | BFS/DFS 2-colouring | O(V + E) | O(V) |
| Shortest path, unweighted | BFS | O(V + E) | O(V) |
| Shortest path, non-negative weights | Dijkstra (binary heap) | O((V + E) log V) | O(V + E) |
| Shortest path, ≤ k edges / negative weights | Bellman-Ford | O(k · E) / O(V · E) | O(V) |
| Minimum spanning tree | Kruskal / Prim | O(E log E) / O(E log V) or O(V²) | O(V + E) |

## Patterns in this topic

- **Graph DFS / Graph BFS**: traversal, reachability, components, cloning, BFS shortest paths (Word Ladder).
- **Topological Sort**: ordering with dependencies and directed cycle detection (Course Schedule I/II, Alien Dictionary).
- **Union-Find**: components and "which edge closes a cycle" (Connected Components, Redundant Connection, Kruskal).
- **Shortest Path**: Dijkstra and Bellman-Ford (Network Delay Time, Cheapest Flights).
- **Minimum Spanning Tree**: Prim / Kruskal (Min Cost to Connect All Points).
- **Hash Map**: mapping originals to copies, or labels to vertices.

## JS gotchas

- `new Array(n).fill([])` fills every slot with **the same** array. Use `Array.from({ length: n }, () => [])`.
- `queue.shift()` is O(n). Use a head index.
- Recursion depth: Node runs out of stack at roughly 10⁴ frames. Prefer iterative traversals when paths can be long.
- `Uint8Array`/`Int32Array` make compact, zero-initialised visited/in-degree arrays.
- Watch the edge direction in prerequisite problems: `[a, b]` usually means **b before a**, i.e. the edge `b → a`.

## Problem order

1. **Find if Path Exists in Graph** (Easy): edge list → adjacency list, iterative BFS/DFS, visited set.
2. **Clone Graph** (Medium): traversal plus an original → copy hash map.
3. **Course Schedule** (Medium): directed cycle detection with Kahn's algorithm or 3-colour DFS.
4. **Course Schedule II** (Medium): produce the topological order itself.
5. **Number of Connected Components in an Undirected Graph** (Medium): union-find vs. traversal.
6. **Redundant Connection** (Medium): the first edge whose endpoints are already connected.
7. **Is Graph Bipartite?** (Medium): BFS/DFS 2-colouring across all components.
8. **Network Delay Time** (Medium): Dijkstra with a min-heap.
9. **Cheapest Flights Within K Stops** (Medium): Bellman-Ford limited to k + 1 edges.
10. **Min Cost to Connect All Points** (Medium): minimum spanning tree on a complete graph (Prim / Kruskal).
11. **Word Ladder** (Hard): BFS on an implicit graph of words.
12. **Alien Dictionary** (Hard): build the graph from sorted words, then topological sort.
