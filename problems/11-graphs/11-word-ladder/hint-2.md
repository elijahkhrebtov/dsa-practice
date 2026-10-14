# Hint 2

**BFS** level by level from `beginWord`: level = number of words in the sequence so far. The first time you dequeue `endWord`, its level is the answer.

The expensive part is finding neighbours. Comparing against every word in the list costs O(N) per word. Two faster ways:

- **Try every edit**: for each position, try all 26 letters and look the result up in a `Set` of the remaining words.
- **Wildcard buckets**: "hot" belongs to the patterns `*ot`, `h*t` and `ho*`. Group all words by pattern in a `Map` once; two words are neighbours exactly when they share a pattern.

Either way, remove/mark words as visited the moment you enqueue them, so nothing is processed twice.
