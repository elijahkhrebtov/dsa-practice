# Hint 2

Keep the interval that **ends earliest**. Whatever an optimal solution keeps first, swapping it for the earliest-ending interval can't cause a new conflict. This is the classic activity-selection greedy.

So sort by **end** time, not by start time. Sorting by start fails on `[[1, 100], [2, 3], [4, 5]]`.
