# Hint 2

Keep a `Map` from **original node → its copy**. It is both your visited set and your lookup table.

Traverse the graph (DFS or BFS). Whenever you meet a neighbour that isn't in the map yet, create its copy, store it, and schedule the neighbour to be processed. Then append the neighbour's copy to the current node's copy's `neighbors`.
