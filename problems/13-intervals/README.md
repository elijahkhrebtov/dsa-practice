# Intervals

An **interval** is a contiguous range between a start point and an end point, such as a meeting from 9:00 to 10:30, a booking from day 3 to day 7, or a range of memory addresses. Interval problems ask you to merge, insert, count, schedule or compare them.

## Representation in JavaScript

An interval is a two-element array `[start, end]` with `start <= end`, and a collection is an array of them:

```js
const meetings = [[0, 30], [5, 10], [15, 20]];
const [start, end] = meetings[0];
```

Unless a problem says otherwise, the input is **not sorted**. Sorting is usually step one.

## Inclusive vs half-open

Before writing any comparison, decide what the endpoints mean. Most off-by-one bugs in this topic come from skipping that step.

| Convention | Notation | Contains | Do `[1, 5]` and `[5, 8]` overlap? |
| --- | --- | --- | --- |
| Closed (inclusive) | `[s, e]` | every x with s ≤ x ≤ e | **yes**: they share the point 5 |
| Half-open | `[s, e)` | every x with s ≤ x < e | **no**: one ends exactly when the other starts |

Time ranges are naturally **half-open**: a meeting that ends at 5 doesn't conflict with one that starts at 5. Problems differ, so every problem in this topic says explicitly how touching intervals are treated:

- Meeting Rooms, Non-overlapping Intervals, Meeting Rooms II: touching is **not** a conflict (half-open).
- Merge Intervals, Insert Interval: touching intervals **are merged** (closed).

## The overlap test

Two intervals `a` and `b` overlap exactly when **each one starts before the other ends**:

```js
// closed intervals: sharing an endpoint counts
const overlapClosed = a[0] <= b[1] && b[0] <= a[1];
// half-open intervals: sharing an endpoint does not count
const overlapHalfOpen = a[0] < b[1] && b[0] < a[1];
```

It's often easier to think about the complement: they do **not** overlap when one ends before the other starts (`a[1] < b[0] || b[1] < a[0]`).

If the intervals are sorted by start (so `a[0] <= b[0]`), the test shrinks to a single comparison: `b[0] <= a[1]` (closed) or `b[0] < a[1]` (half-open). The intersection, when there is one, is `[max(a[0], b[0]), min(a[1], b[1])]`.

## Sort by start or sort by end?

| Sort by | When it's right | Why |
| --- | --- | --- |
| **start** | merging, inserting, "can I attend everything?", finding gaps | After sorting, any interval that overlaps the current group must start before the group ends, so you only ever compare against the last merged interval. |
| **end** | choosing the **maximum number of non-overlapping** intervals, or the minimum number to remove (activity selection) | Greedy: the interval that **finishes first** leaves the most room for everything else. Sorting by start fails here, because a long interval that starts early can block many short ones. |

Example of sort-by-start going wrong for activity selection: `[[1, 100], [2, 3], [4, 5]]`. Taking the earliest start `[1, 100]` keeps 1 interval. Taking the earliest end `[2, 3]`, then `[4, 5]`, keeps 2.

Sorting `[start, end]` pairs in JS needs a comparator. The default `sort()` compares as strings:

```js
intervals.sort((a, b) => a[0] - b[0]);          // by start
intervals.sort((a, b) => a[1] - b[1]);          // by end
intervals.toSorted((a, b) => a[0] - b[0]);      // non-mutating copy (Node 20+)
```

`sort()` mutates the caller's array. If a problem says not to modify the input, sort a copy (`[...intervals].sort(…)` or `toSorted`). Note that copying the outer array doesn't copy the inner `[start, end]` arrays, so don't edit those in place either.

## Sweep line

Turn each interval into two **events**, `+1` at its start and `-1` at its end. Then sort the events by time and sweep left to right, keeping a running count. The count at any moment is the number of intervals active at that moment. Its maximum answers questions like "how many rooms / CPUs / parallel connections do we need?"

```
[0,30] [5,10] [15,20]  →  events: 0:+1  5:+1  10:-1  15:+1  20:-1  30:-1
running count:                     1     2     1      2      1      0    → peak 2
```

Ties matter. For half-open intervals, process **ends before starts** at the same time, so a meeting ending at 10 frees its room before one starting at 10 needs it. An equivalent formulation sorts all starts and all ends separately and walks them with two pointers. Another uses a min-heap of end times (see Meeting Rooms II).

## Complexity

| Operation | Time | Notes |
| --- | --- | --- |
| Overlap test for two intervals | O(1) | two comparisons |
| Sort n intervals | O(n log n) | almost always the bottleneck |
| Merge all overlaps (after sorting) | O(n) | one pass comparing with the last merged interval |
| Insert into a sorted, non-overlapping list | O(n) | no sort needed; three phases: before, overlapping, after |
| Max non-overlapping set / min removals | O(n log n) | sort by end, then a greedy pass |
| Max simultaneous overlap (sweep line or heap) | O(n log n) | sort events, or a heap of end times |

## Patterns in this topic

- **Intervals**: sort, then reason about the last interval kept or merged.
- **Sorting**: almost every interval solution starts here. Choose the key deliberately.
- **Greedy**: earliest end first for selection and removal problems.
- **Sweep Line**: convert intervals to start/end events and track a running count.
- **Heap**: a min-heap of end times answers "which resource frees up first?" (`lib/priority-queue.js` is available).

## Problem order

1. **Meeting Rooms** (Easy): sort by start, check neighbours. Introduces the half-open convention.
2. **Merge Intervals** (Medium): sort by start, then extend or close the current group.
3. **Insert Interval** (Medium): linear-time merge of one interval into a sorted list.
4. **Non-overlapping Intervals** (Medium): sort by end plus greedy (activity selection).
5. **Meeting Rooms II** (Medium): maximum overlap via a min-heap or a sweep line.
