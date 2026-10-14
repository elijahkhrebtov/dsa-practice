# Hint 1

You need two different abilities at once:

1. Find a key's entry instantly (for `get` and for updates).
2. Keep all entries **ordered by recency** so you can move any entry to the "most recent" end, and remove the entry at the "least recent" end, without shifting everything else.

A hash map handles (1) in O(1). Which data structure lets you take an element out of the middle and re-insert it at one end in O(1), as long as you already hold a reference to it?
