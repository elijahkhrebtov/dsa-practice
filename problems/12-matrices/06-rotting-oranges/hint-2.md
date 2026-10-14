# Hint 2

Breadth-first search finds shortest distances in a grid, and it can start from **many sources at once**: put *every* initially rotten orange in the queue before you begin. BFS then expands in rings, and ring k is exactly the set of oranges that rot in minute k.

Count the fresh oranges up front, so at the end you know whether any were never reached.
