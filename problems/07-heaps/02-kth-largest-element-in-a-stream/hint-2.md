# Hint 2

Keep only the k largest numbers seen so far in a **min-heap** of size k. The answer is its root, the smallest of the top k.

On `add(val)`: push it, and if the heap now has more than k items, pop the smallest. The constructor can reuse exactly the same logic for each starting number.
