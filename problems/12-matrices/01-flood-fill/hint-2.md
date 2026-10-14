# Hint 2

Remember the original colour, and return straight away if it equals `color`. Otherwise run a DFS (or BFS) from `(sr, sc)`: paint a pixel, then visit each in-bounds neighbour that still has the original colour. A painted pixel no longer matches, so it is never visited twice and you don't need a separate `visited` grid.

For the 500 × 500 test, don't recurse. Keep an explicit stack (an array with `push`/`pop`) of pixels to process, and paint each pixel at the moment you push it.
