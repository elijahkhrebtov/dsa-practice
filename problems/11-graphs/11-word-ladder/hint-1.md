# Hint 1

Picture every word as a node, with an edge between two words that differ in exactly one position. The question "fewest words from `beginWord` to `endWord`" is then "shortest path in an **unweighted** graph".

Which traversal finds shortest paths in an unweighted graph? And do you really need to build the whole graph up front, or can you discover a word's neighbours only when you reach it?
