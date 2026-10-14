# Hint 3

The order of operations is what makes cycles safe: **register a copy in the map at the moment you create it**, before you look at that node's neighbours.

Iteratively: start with `map = {start → copy(start)}` and `stack = [start]`. Pop a node, and for each of its neighbours in order — if it has no copy, create it, add it to the map and push the neighbour; either way, push `map.get(neighbour)` onto `map.get(current).neighbors`. Return `map.get(start)`. Each node gets pushed exactly once, so each copy's neighbour list is filled exactly once.
