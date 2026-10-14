/*
 * Title:      Kth Largest Element in an Array
 * Difficulty: Medium
 * Patterns:   Heap, Quickselect
 *
 * Solution — Kth Largest Element in an Array
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Sorting answers the question for EVERY rank at once, which is more work
 * than we need. We only want one rank. There are two classic ways to do less:
 *
 *   A) Heap. Keep a min-heap of the k largest elements seen so far (same as
 *      the "stream" problem). After one pass its root is the answer.
 *      O(n log k) time, O(k) space. Simple and great when k is small.
 *
 *   B) Quickselect. The k-th largest is the element that would land at
 *      index t = n - k in ASCENDING order. Partition around a pivot the way
 *      quicksort does. Afterwards you know exactly which range of indices
 *      the pivot's value occupies. If t is in that range, you're done.
 *      Otherwise recurse into the ONE side that contains t. On average the
 *      side halves each time: n + n/2 + n/4 + … = O(n).
 *
 * The implementation below uses quickselect. Two details keep it O(n) on
 * average for EVERY input:
 *   • Random pivot. A fixed pivot (first/last element) on sorted input
 *     peels off one element per round, which is O(n²).
 *   • Three-way partition (Dutch national flag): < pivot | = pivot | > pivot.
 *     With a two-way partition, an array of equal values also peels off one
 *     element per round. With three ways, the entire "= pivot" block is
 *     settled in one pass.
 *
 * Approach (iterative quickselect)
 * ────────────────────────────────
 *   1. t = n - k; lo = 0; hi = n - 1.
 *   2. Loop:
 *        a. pivot = nums[random index in lo..hi]
 *        b. Three-way partition nums[lo..hi] into
 *             [lo, lt)  < pivot,  [lt, gt]  = pivot,  (gt, hi]  > pivot
 *        c. if t < lt → hi = lt - 1;  else if t > gt → lo = gt + 1;
 *           else return pivot.
 *
 * Walkthrough — nums = [3, 2, 1, 5, 6, 4], k = 2 → t = 4
 * ───────────
 *   (pivots are random; suppose they come out as 3, 4, 6, 5)
 *   lo=0 hi=5 pivot 3:  [2, 1, 3, 6, 4, 5]   lt=2 gt=2   t=4 > gt → lo = 3
 *   lo=3 hi=5 pivot 4:  [·, ·, ·, 4, 5, 6]   lt=3 gt=3   t=4 > gt → lo = 4
 *   lo=4 hi=5 pivot 6:  [·, ·, ·, ·, 5, 6]   lt=5 gt=5   t=4 < lt → hi = 4
 *   lo=4 hi=4 pivot 5:                       lt=4 gt=4   t inside → return 5 ✓
 *
 * Complexity
 * ──────────
 *   Quickselect: O(n) expected time (O(n²) worst case, astronomically
 *                unlikely with random pivots), O(1) extra space.
 *   Heap:        O(n log k) time, O(k) space, and no worst-case surprises.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Sorting: O(n log n). Fine in practice, but it isn't the point here.
 *   • Max-heap of all n elements then k pops: O(n + k log n) with heapify.
 *   • Counting sort: values are bounded (|v| <= 10^4), so a 20,001-slot
 *     count array walked from the top gives O(n + range). It's a neat trick
 *     for bounded inputs.
 *   • Off-by-one: the k-th LARGEST is index n - k in ascending order (not
 *     k - 1, and not n - k - 1).
 *   • Lomuto/Hoare two-way partitions are fine for distinct values but need
 *     care with duplicates. Lomuto in particular sends every equal element
 *     to one side and degenerates to O(n²) on [7, 7, 7, …].
 *   • Recursion depth is fine on average, but a loop avoids any risk.
 *   • Median-of-medians gives a guaranteed O(n) worst case, at a much
 *     larger constant factor. Rarely worth it in practice.
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @returns {number}
 */
export function findKthLargest(nums, k) {
  const target = nums.length - k; // index of the answer in ascending order
  let lo = 0;
  let hi = nums.length - 1;

  while (true) {
    const pivot = nums[lo + Math.floor(Math.random() * (hi - lo + 1))];

    // Three-way partition of nums[lo..hi] (Dutch national flag):
    //   [lo, lt) < pivot   [lt, i) == pivot   [i, gt] unknown   (gt, hi] > pivot
    let lt = lo;
    let gt = hi;
    let i = lo;
    while (i <= gt) {
      if (nums[i] < pivot) {
        [nums[lt], nums[i]] = [nums[i], nums[lt]];
        lt++;
        i++;
      } else if (nums[i] > pivot) {
        [nums[i], nums[gt]] = [nums[gt], nums[i]];
        gt--; // don't advance i: the swapped-in element is still unknown
      } else {
        i++;
      }
    }

    if (target < lt) hi = lt - 1; // answer is among the smaller elements
    else if (target > gt) lo = gt + 1; // answer is among the bigger elements
    else return pivot; // target falls inside the block of values equal to the pivot
  }
}
