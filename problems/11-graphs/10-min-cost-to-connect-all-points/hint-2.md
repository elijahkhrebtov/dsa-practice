# Hint 2

This is a **minimum spanning tree** (exactly `n - 1` edges, no cycles). Two classic algorithms:

- **Kruskal**: sort all edges by weight, take each one unless it would close a cycle (check with **Union-Find**).
- **Prim**: grow one tree from any start point, always adding the cheapest edge that leaves the tree.

Here the graph is complete (~n²/2 edges). Which of the two can avoid materializing and sorting all those edges?
