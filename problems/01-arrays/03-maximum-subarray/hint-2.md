# Hint 2

A prefix whose sum is negative can only drag down whatever comes after it — so drop it and start fresh. This is **Kadane's algorithm**, a tiny dynamic program where the state is "best sum of a subarray ending here".

Keep two numbers while scanning: `current` (best sum ending at the current index) and `best` (best seen anywhere so far).
