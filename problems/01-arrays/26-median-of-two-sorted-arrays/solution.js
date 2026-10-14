/*
 * Title:      Median of Two Sorted Arrays
 * Difficulty: Hard
 * Patterns:   Binary Search, Divide & Conquer
 *
 * Solution — Median of Two Sorted Arrays
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * We never need the merged array — only a correct CUT through it. Cut the
 * merged order into a left part of size half = ⌊(m + n + 1) / 2⌋ and a
 * right part with the rest. The median is then the largest value on the
 * left (odd total) or the average of the largest left and smallest right
 * value (even total).
 *
 * Any cut of the merged array corresponds to cutting each input array
 * separately: the left part = the first i elements of nums1 plus the first
 * j = half - i elements of nums2. So a single number i describes the cut.
 * The cut is correct exactly when nothing on the left exceeds anything on
 * the right. Since each array is sorted by itself, it's enough to check the
 * two "cross" pairs:
 *
 *        nums1:  … A[i-1] | A[i] …
 *        nums2:  … B[j-1] | B[j] …
 *
 *        valid  ⇔  A[i-1] <= B[j]  and  B[j-1] <= A[i]
 *
 * And it's monotonic: if A[i-1] > B[j], we took too much of A — any larger
 * i is also wrong, so search left. If B[j-1] > A[i], we took too little of
 * A — search right. That's a binary search on i. Doing it over the SHORTER
 * array gives O(log(min(m, n))) and guarantees 0 <= j <= n.
 *
 * Approach (binary search on the partition)
 * ─────────────────────────────────────────
 *   1. If nums1 is longer, swap the arrays. Let m <= n.
 *   2. half = ⌊(m + n + 1) / 2⌋;  lo = 0, hi = m.
 *   3. While lo <= hi:
 *        i = ⌊(lo + hi) / 2⌋, j = half - i
 *        aLeft  = i > 0 ? A[i-1] : -∞     aRight = i < m ? A[i] : +∞
 *        bLeft  = j > 0 ? B[j-1] : -∞     bRight = j < n ? B[j] : +∞
 *        if aLeft > bRight → hi = i - 1
 *        elif bLeft > aRight → lo = i + 1
 *        else → found:
 *             odd total:  max(aLeft, bLeft)
 *             even total: (max(aLeft, bLeft) + min(aRight, bRight)) / 2
 *   The infinities handle "this side of the cut is empty" without special
 *   cases, including an entirely empty nums1 (m = 0 → only i = 0 is tried).
 *
 * Walkthrough — nums1 = [1, 3, 8], nums2 = [4, 9, 10]  (total 6, half = 3)
 * ───────────
 *   lo=0 hi=3: i=1 j=2  aLeft=1 aRight=3  bLeft=9 bRight=10
 *              bLeft 9 > aRight 3 → too little of A → lo=2
 *   lo=2 hi=3: i=2 j=1  aLeft=3 aRight=8  bLeft=4 bRight=9
 *              3 <= 9 and 4 <= 8 → valid cut: left {1,3,4} | right {8,9,10}
 *              even total → (max(3,4) + min(8,9)) / 2 = (4 + 8) / 2 = 6
 *
 * Complexity
 * ──────────
 *   Time:  O(log(min(m, n))) — binary search over the shorter array.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Concatenate and sort: O((m + n) log(m + n)). Merge with two pointers,
 *     stopping at the middle: O(m + n). Both fine for small inputs, far too
 *     slow for thousands of queries on million-element arrays.
 *   • Divide & conquer "k-th smallest of two sorted arrays": compare
 *     A[k/2 - 1] with B[k/2 - 1] and discard the k/2 smallest elements of
 *     the side with the smaller value; recurse with k - k/2. O(log(m + n)),
 *     and it generalizes to any k, not only the median.
 *   • Searching over the longer array lets j go negative or past n.
 *   • Using half = (m + n) / 2 without the +1 is fine too, but then the
 *     odd-total median is min(aRight, bRight) — mixing the conventions is a
 *     classic bug.
 *   • Returning an integer-divided average (e.g. `>> 1`) loses the .5.
 */

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @returns {number}
 */
export function findMedianSortedArrays(nums1, nums2) {
  // Binary search over the shorter array so j = half - i always stays in range.
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);

  const m = nums1.length;
  const n = nums2.length;
  const half = (m + n + 1) >> 1; // size of the left part (gets the extra element when odd)

  let lo = 0;
  let hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1; // elements taken from nums1 into the left part
    const j = half - i; // elements taken from nums2 into the left part

    const aLeft = i > 0 ? nums1[i - 1] : -Infinity;
    const aRight = i < m ? nums1[i] : Infinity;
    const bLeft = j > 0 ? nums2[j - 1] : -Infinity;
    const bRight = j < n ? nums2[j] : Infinity;

    if (aLeft > bRight) {
      hi = i - 1; // took too many from nums1
    } else if (bLeft > aRight) {
      lo = i + 1; // took too few from nums1
    } else {
      const leftMax = Math.max(aLeft, bLeft);
      if ((m + n) % 2 === 1) return leftMax;
      return (leftMax + Math.min(aRight, bRight)) / 2;
    }
  }

  throw new Error('unreachable: inputs must be sorted'); // a valid cut always exists
}
