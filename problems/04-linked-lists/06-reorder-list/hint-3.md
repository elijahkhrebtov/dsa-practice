# Hint 3

- Start `slow = head`, `fast = head` and advance while `fast.next && fast.next.next`. `slow` stops at the end of the first half, which is the middle node for odd lengths and the last node of the left half for even lengths. That way the first half is never shorter than the second.
- `second = reverse(slow.next)`, then `slow.next = null`.
- Merge: while `second` is not null, save `first.next` and `second.next`, set `first.next = second` and `second.next = savedFirstNext`, then advance both from the saved pointers. The first half is equal in length or one node longer, so its last node stays the tail.
