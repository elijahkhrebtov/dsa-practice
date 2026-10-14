/*
 * Title:      Top K Frequent Elements
 * Difficulty: Medium
 * Patterns:   Hash Map, Bucket Sort, Top-K
 *
 * Solution — Top K Frequent Elements
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Step one is unavoidable and cheap: count every value with a hash map,
 * O(n). The interesting part is picking the k largest counts.
 *
 * Sorting all distinct values by count costs O(u log u). But counts are
 * special: they're integers between 1 and n. When the keys you sort by
 * are small bounded integers, you don't need a comparison sort. Use them
 * directly as array indices (bucket sort). bucket[f] holds every value
 * that occurs exactly f times. Walking the buckets from f = n down to 1
 * visits values in decreasing frequency, and we stop after collecting k.
 *
 * Approach
 * ────────
 *   1. counts = Map value → frequency (one pass over nums).
 *   2. buckets = array of n + 1 empty lists (frequency ranges over 1..n).
 *      For each (value, f) in counts: buckets[f].push(value).
 *   3. For f from n down to 1, append the values in buckets[f] to the
 *      result until it holds k values. Because the answer is unique, we
 *      never have to choose between values inside a bucket that straddles
 *      the cut.
 *
 * Walkthrough — nums = [1, 1, 1, 2, 2, 3], k = 2
 * ───────────
 *   counts:  {1: 3, 2: 2, 3: 1}
 *   buckets: [0]: []  [1]: [3]  [2]: [2]  [3]: [1]  [4..6]: []
 *   f=6,5,4: empty
 *   f=3: take 1          → [1]
 *   f=2: take 2          → [1, 2]   k reached, done
 *
 * Complexity
 * ──────────
 *   Time:  O(n): counting is O(n), filling buckets is O(u) ≤ O(n), and the
 *          scan touches at most n + 1 buckets.
 *   Space: O(n) for the map and the buckets.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Count + sort by frequency: O(n + u log u). Simple, and often fine in
 *     practice, but not the asked-for "better than O(n log n)".
 *   • Min-heap of size k (e.g. lib/priority-queue.js keyed by count): push
 *     every (value, count), and pop whenever the heap holds more than k. The
 *     heap always keeps the k largest counts seen so far. O(n + u log k)
 *     time, O(u + k) space. It shines when k is much smaller than u, or when
 *     the data arrives as a stream and you can't allocate n buckets.
 *   • Quickselect on the distinct values by count: O(u) average, O(u²)
 *     worst case.
 *   • Re-counting each distinct value by scanning nums (nums.filter(...)) is
 *     O(n · u). That's the slow path the performance test catches.
 *   • Off-by-one: a value can occur n times, so the bucket array needs
 *     n + 1 slots. Return the VALUES, not their counts.
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @returns {number[]}
 */
export function topKFrequent(nums, k) {
  // 1. Frequency of every value.
  const counts = new Map();
  for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1);

  // 2. buckets[f] = values that occur exactly f times (f is at most n).
  /** @type {number[][]} */
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, f] of counts) buckets[f].push(value);

  // 3. Collect from the highest frequency downwards until we have k values.
  const result = [];
  for (let f = nums.length; f >= 1 && result.length < k; f--) {
    for (const value of buckets[f]) {
      result.push(value);
      if (result.length === k) break;
    }
  }
  return result;
}
