# Hint 3

For each point: while the heap holds fewer than k items, just push. Once it's full, compare the point's squared distance with the root's. If it's smaller, pop the root and push the new point. Otherwise skip it.

At the end the heap holds exactly the k closest points. Pop them all (in any order) and return the points.
