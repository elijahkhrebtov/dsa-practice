# Hint 3

In phase 2, grow the interval with `newStart = min(newStart, start)` and `newEnd = max(newEnd, end)`. Work on local variables, not on `newInterval` or the input arrays.

Check the boundaries: phase 1 uses a strict `<` and phase 2 uses `<=`, which is what makes touching intervals merge. Also make sure the merged interval is still appended when phase 2 absorbs nothing, and when the new interval goes at the very beginning or the very end.
