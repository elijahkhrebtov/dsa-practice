# Hint 3

- The next free slot is `(head + count) % k`. Write there, then increment `count`.
- The rear element is at `(head + count - 1) % k`.
- Dequeue moves `head` to `(head + 1) % k` and decrements `count`. The old value can stay in the array, since it's simply ignored.

Check the empty/full conditions first, so `Front`/`Rear` return -1 and a rejected `enQueue`/`deQueue` changes nothing. Watch out for two bugs: computing the rear as `tail - 1` without wrapping (it should be `k - 1` when `tail` is 0), and testing emptiness with truthiness (`0` is a valid element).
