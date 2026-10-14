# Hint 2

Every count is an integer between 1 and `n`. Integers in a small known range can be "sorted" without comparisons by using them as **array indices**: that's **bucket sort**.

(Another valid route: keep a **min-heap of size k** ordered by count, which is O(n log k). `lib/priority-queue.js` has one ready to use.)
