/*
 * Title:      Median of Two Sorted Arrays
 * Difficulty: Hard
 * Patterns:   Binary Search, Divide & Conquer
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given two arrays `nums1` (length m) and `nums2` (length n), each
 * sorted in non-decreasing order (duplicates allowed). Return the median of
 * all m + n numbers taken together, as if both arrays were merged into one
 * sorted array.
 *
 *   • If m + n is odd, the median is the middle element of the merged order.
 *   • If m + n is even, it is the average of the two middle elements (which
 *     may be a non-integer such as 2.5).
 *   • One of the arrays may be empty, but never both.
 *   • Do not modify either array.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums1 = [1, 3], nums2 = [2]
 *     Output: 2
 *     Why:    merged = [1, 2, 3]; the middle element is 2.
 *
 *   Example 2
 *     Input:  nums1 = [1, 2], nums2 = [3, 4]
 *     Output: 2.5
 *     Why:    merged = [1, 2, 3, 4]; (2 + 3) / 2 = 2.5.
 *
 *   Example 3
 *     Input:  nums1 = [], nums2 = [1]
 *     Output: 1
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= m, n <= 1000 and 1 <= m + n <= 2000 (the performance test uses
 *     arrays of 10^6 elements)
 *   • -10^6 <= nums1[i], nums2[i] <= 10^6
 *   • Both arrays are sorted in non-decreasing order.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(log(min(m, n))) time and O(1) extra space. Merging (even stopping at
 *   the middle) is O(m + n); the performance test calls your function
 *   thousands of times on two arrays of a million elements each, so only a
 *   logarithmic solution keeps up.
 */

// ▶ Run tests:   npm run solve median-of-two-sorted-arrays
// ⟳ Watch mode:  npm run watch median-of-two-sorted-arrays

/**
 * Finds the median of the union of two sorted arrays without merging them.
 *
 * @param {number[]} nums1 - First array, sorted non-decreasingly (may be empty).
 * @param {number[]} nums2 - Second array, sorted non-decreasingly (may be empty, but not both).
 * @returns {number} The median of all m + n values (the mean of the two middle values when m + n is even).
 */
export function findMedianSortedArrays(nums1, nums2) {
  // Your code here
}
