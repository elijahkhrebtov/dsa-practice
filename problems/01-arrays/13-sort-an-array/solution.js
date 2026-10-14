/*
 * Title:      Sort an Array
 * Difficulty: Medium
 * Patterns:   Sorting, Divide & Conquer
 *
 * Solution — Sort an Array
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Any comparison sort needs Ω(n log n) comparisons in the worst case, and
 * the tests deliberately include the inputs that break the "usually fast"
 * algorithms (sorted, reverse-sorted, all equal). So we want an algorithm
 * whose WORST case is O(n log n). Merge sort is the classic answer:
 *
 *   • Two sorted arrays can be merged into one sorted array in linear time:
 *     repeatedly take the smaller of the two front elements.
 *   • So: split the array in half, sort each half (recursively), merge.
 *
 * The recursion has log2(n) levels and each level does O(n) merging work in
 * total, regardless of what the data looks like.
 *
 * Approach
 * ────────
 *   1. Allocate one auxiliary buffer `buf` of length n (reused by every merge).
 *   2. mergeSort(lo, hi) on the half-open range [lo, hi):
 *        a. If hi - lo < 2, it's already sorted.
 *        b. mid = (lo + hi) >> 1; mergeSort(lo, mid); mergeSort(mid, hi).
 *        c. If a[mid - 1] <= a[mid], the halves are already in order — skip
 *           the merge (makes sorted / all-equal inputs O(n)).
 *        d. Merge the two halves into buf[lo..hi), taking from the LEFT half
 *           on ties (this keeps the sort stable), then copy back.
 *   3. Return the array.
 *
 * We sort in place (into `nums`) and return it — the problem allows that.
 *
 * Walkthrough — nums = [5, 2, 3, 1]
 * ───────────
 *   split  [5, 2] | [3, 1]
 *   split  [5] [2]          → merge → [2, 5]
 *   split  [3] [1]          → merge → [1, 3]
 *   merge  [2, 5] + [1, 3]:
 *            1 < 2 → take 1      [1]
 *            2 < 3 → take 2      [1, 2]
 *            3 < 5 → take 3      [1, 2, 3]
 *            right empty → 5     [1, 2, 3, 5]
 *
 * Complexity
 * ──────────
 *   Time:  O(n log n) in every case — log n levels × O(n) merge work.
 *          (With the "already in order" check, sorted input is O(n).)
 *   Space: O(n) for the buffer + O(log n) recursion stack.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Bubble / insertion / selection sort: O(n²). Insertion sort is great
 *     for tiny or nearly-sorted arrays (real libraries use it for small
 *     sub-ranges), but not for 100,000 random numbers.
 *   • Quicksort: O(n log n) on average and in place, but O(n²) in the worst
 *     case. A first/last-element pivot hits that worst case on sorted input
 *     (and recurses 10^5 deep → stack overflow). Lomuto/Hoare partitions that
 *     send keys equal to the pivot to one side degrade on all-equal input.
 *     Fix both with a random pivot + three-way (Dutch flag) partition.
 *   • Heapsort: O(n log n) worst case, O(1) extra space, not stable, and
 *     usually slower in practice than merge sort.
 *   • Counting sort: the values lie in [-5·10^4, 5·10^4], so counting
 *     occurrences in an array of size 100,001 sorts in O(n + range). Very
 *     fast here, but only works for small integer ranges.
 *   • Creating new arrays at every level (`slice`, `concat`, spreading) is
 *     still O(n log n) but allocates a lot; one shared buffer is faster.
 *   • Forgetting to copy the leftovers of one half after the other runs out
 *     is the most common merge bug.
 */

/**
 * @param {number[]} nums
 * @returns {number[]}
 */
export function sortArray(nums) {
  const buf = new Array(nums.length); // shared scratch space for merges

  /** Sorts nums[lo..hi) in place. */
  function mergeSort(lo, hi) {
    if (hi - lo < 2) return;
    const mid = (lo + hi) >> 1;
    mergeSort(lo, mid);
    mergeSort(mid, hi);
    if (nums[mid - 1] <= nums[mid]) return; // halves already in order

    let i = lo; // next element of the left half
    let j = mid; // next element of the right half
    let k = lo; // next free slot in buf
    while (i < mid && j < hi) {
      // `<=` takes from the left on ties → stable
      buf[k++] = nums[i] <= nums[j] ? nums[i++] : nums[j++];
    }
    while (i < mid) buf[k++] = nums[i++]; // leftovers of the left half
    while (j < hi) buf[k++] = nums[j++]; // leftovers of the right half
    for (let t = lo; t < hi; t++) nums[t] = buf[t];
  }

  mergeSort(0, nums.length);
  return nums;
}
