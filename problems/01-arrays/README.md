# Arrays

An array is an ordered sequence of elements stored by **index** (0, 1, 2, …). Reading or writing `a[i]` takes constant time, which makes arrays the backbone of almost every other data structure, and the input to most interview problems.

## Arrays in JavaScript

- `const a = [3, 1, 2];` is a dynamic array: it grows and shrinks as needed, and it can hold mixed types (please don't).
- `new Array(n).fill(0)` or `Array.from({ length: n }, (_, i) => i)` preallocates `n` slots. `new Array(n)` alone creates *holes*, not `undefined` values. Methods like `map` and `forEach` skip holes.
- For 2-D grids, use `Array.from({ length: rows }, () => new Array(cols).fill(0))`. Writing `new Array(rows).fill(new Array(cols))` shares **one** inner array across every row.
- Typed arrays (`Int32Array`, `Float64Array`, `Uint8Array`) are fixed-size, numeric, zero-initialized and often faster for big DP tables.

## Operations and their cost

| Operation | Example | Time |
| --- | --- | --- |
| Read / write by index | `a[i]`, `a[i] = x` | O(1) |
| Length | `a.length` | O(1) |
| Append / remove at the end | `push`, `pop` | O(1) amortized |
| Insert / remove at the front | `unshift`, `shift` | **O(n)** (every element moves) |
| Insert / remove in the middle | `splice(i, 0, x)`, `splice(i, 1)` | O(n) |
| Search unsorted | `indexOf`, `includes`, `find` | O(n) |
| Search sorted | binary search (write it yourself) | O(log n) |
| Copy / slice | `[...a]`, `a.slice(i, j)` | O(n) / O(j − i) |
| Sort | `a.sort((x, y) => x - y)` | O(n log n) |
| Reverse | `a.reverse()` | O(n) |

## JavaScript gotchas

- **`sort()` without a comparator sorts as strings**: `[10, 9, 1].sort()` gives `[1, 10, 9]`. Always pass `(a, b) => a - b` for numbers.
- `sort` and `reverse` work **in place** and return the same array. Use `toSorted` / `toReversed` (or copy first) when you must not mutate the input.
- `shift()` and `unshift()` are O(n). To use an array as a queue, keep a head index instead of shifting.
- `slice` and the spread operator copy, so calling them inside a loop quietly turns O(n) code into O(n²).
- Reassigning a parameter (`nums = [...]`) doesn't change the caller's array. In-place problems require writing `nums[i] = …`.
- `Math.max(...arr)` spreads the array into function arguments and throws a RangeError for very large arrays (around 10^5 or more elements). Use a loop or `reduce` instead.
- `0 * -1` is `-0`. It equals `0` with `===`, but Vitest's `toEqual` treats the two as different.
- `Number.MAX_SAFE_INTEGER` is 2^53 − 1. Sums and products beyond that lose precision; use `BigInt` or take a modulus.
- `(lo + hi) >> 1` is safe for array indices, but `>>` truncates to 32 bits, so prefer `Math.floor((lo + hi) / 2)` for arbitrary large numbers.

## Patterns you'll meet in this topic

- **Greedy / running state**: keep the best answer so far plus one or two numbers (e.g. the minimum seen so far) in a single pass.
- **Binary search**: halve a sorted range each step. Variants find a boundary (first/last occurrence), search a rotated array, or search the *answer space* ("Binary Search on Answer").
- **Kadane's algorithm and prefix sums/products**: compute something about every subarray or "everything except i" from running totals.
- **Two pointers**: pointers moving toward each other (Container With Most Water, 3Sum) or partitioning in place (Sort Colors).
- **Sliding window**: a window that grows on the right and shrinks on the left, with each element entering and leaving once.
- **Cyclic sort / index as hash**: when the values are 1..n, the array itself can record which values were seen (First Missing Positive, Find the Duplicate Number).
- **Sorting** algorithms you write yourself (merge sort, quick sort, heap sort).
- **Dynamic programming**: 1-D DP (House Robber, Jump Game, LIS, Coin Change, Stock with Cooldown) and the 0/1 knapsack (Partition Equal Subset Sum).
- **Backtracking**: generating subsets, permutations and combinations.
- **Segment tree / Fenwick tree**: range queries while the array changes.
- **Divide & conquer**: Median of Two Sorted Arrays.

## Problem order

Easy warm-ups come first, then the Medium problems grouped roughly by pattern (greedy/prefix, two pointers, sliding window, binary search, sorting, DP, segment tree, backtracking), and the Hard problems last. `INDEX.md` shows each problem's difficulty, patterns and your progress.

01. Best Time to Buy and Sell Stock
02. Binary Search
03. Maximum Subarray
04. Product of Array Except Self
05. Sort Colors
06. Container With Most Water
07. 3Sum
08. Minimum Size Subarray Sum
09. Find First and Last Position of Element in Sorted Array
10. Search in Rotated Sorted Array
11. Koko Eating Bananas
12. Find the Duplicate Number
13. Sort an Array
14. Jump Game
15. House Robber
16. Coin Change
17. Longest Increasing Subsequence
18. Partition Equal Subset Sum
19. Best Time to Buy and Sell Stock with Cooldown
20. Range Sum Query - Mutable
21. Subsets
22. Permutations
23. Combination Sum
24. First Missing Positive
25. Trapping Rain Water
26. Median of Two Sorted Arrays
