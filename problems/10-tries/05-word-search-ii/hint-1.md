# Hint 1

You can already find a *single* word with backtracking: start from each cell, step to unvisited neighbours that match the next letter, and unmark cells on the way back.

Now picture 4,000 words that all start with `aaaaaaa`. A per-word search re-explores every `aaaaaaa` path on the board 4,000 times. Is there a way to explore each board path **once** and check it against all the words at the same time?
