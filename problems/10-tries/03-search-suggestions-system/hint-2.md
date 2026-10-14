# Hint 2

Sort a copy of the products once. Then two ways work:

- **Trie**: insert the products **in sorted order**. Every node you pass on the way down remembers the word, but only while it holds fewer than 3. Because words arrive sorted, the first 3 that pass through a node are exactly its 3 smallest matches.
- **Binary search**: in the sorted array, the matches for a prefix form a contiguous block. Its start is the first word `>= prefix` (lower bound), and the answer is up to 3 words from there that really start with the prefix.
