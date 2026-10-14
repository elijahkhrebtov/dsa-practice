# Hint 2

Check the room that frees up **earliest**. If even that room is still busy, every room is busy. Keeping "the earliest end time among occupied rooms" available is exactly what a **min-heap of end times** does.

An alternative that needs no heap is a **sweep line**: sort all start times and all end times separately and walk through both, counting how many meetings are in progress.
