# Hint 3

1. If `endWord` is not in the list, return 0.
2. Build `buckets`: for every word and every position `i`, append the word to `buckets[word with position i replaced by '*']`.
3. BFS from `beginWord` with `visited = {beginWord}`, `level = 1`. Process the queue one level at a time. For each word, for each position, look at its bucket: every unvisited word there is a neighbour — if it is `endWord`, return `level + 1`; otherwise mark it visited and enqueue it. After using a bucket, clear it: every word in it has now been seen, so nobody needs it again.
4. Queue exhausted → return 0.

Bidirectional variant: keep two frontier sets (from the start and from the end). Always expand the smaller one; when a generated neighbour is in the *other* frontier, the two searches have met.
