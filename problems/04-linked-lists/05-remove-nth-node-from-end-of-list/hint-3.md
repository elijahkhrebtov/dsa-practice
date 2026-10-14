# Hint 3

Create `dummy` with `dummy.next = head`, and start both `fast` and `slow` at `dummy`. Move `fast` forward `n` steps. Then move both together until `fast.next` is `null`, meaning `fast` is on the last node.

Now `slow` sits right before the node to delete. Skip it with `slow.next = slow.next.next` and return `dummy.next`. This also covers removing the head, and it returns `null` when the list becomes empty.
