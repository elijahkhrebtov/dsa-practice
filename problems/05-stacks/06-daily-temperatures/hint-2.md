# Hint 2

The days that are still waiting form a sequence whose temperatures never increase from oldest to newest. Keep them on a **monotonic stack**, and store **indices**, not temperatures, since you need the distance.

When a new day arrives, it can only resolve days from the top of that stack, and only the colder ones.
