# Hint 2

Sort by start time (`(a, b) => a[0] - b[0]`). Then a conflict exists exactly when some meeting starts **before** the previous one ends: `intervals[i][0] < intervals[i - 1][1]`. Use a strict `<`, because touching meetings are allowed.
