# Hint 3

1. One scan: collect all `2`s as the current level and count the `1`s. If there are no `1`s, return `0`.
2. While the current level is non-empty **and** fresh oranges remain: build the next level from every fresh 4-neighbour of the current level's cells. Mark each one rotten as soon as you add it, so it can't be added twice, and decrement the fresh count. Then `minutes++`.
3. Return `minutes` if the fresh count reached 0, otherwise `-1`.

Checking "fresh oranges remain" in the loop condition stops you from counting one extra minute after the last orange has rotted.
