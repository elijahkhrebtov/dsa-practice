# Hint 1

You can't keep one slot per possible key, and one long list makes every call O(n). The middle ground is to keep a **small array** and turn each key into an index inside it.

What happens when two different keys map to the same index? How would you still store and find both?
