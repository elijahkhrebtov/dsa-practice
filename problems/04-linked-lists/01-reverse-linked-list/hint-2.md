# Hint 2

Walk the list with three references: `prev` (the already-reversed part, starting at `null`), `curr` (the node you're handling) and `next` (saved **before** you touch `curr.next`).

At each step: save `curr.next`, point `curr.next` back at `prev`, then move `prev` and `curr` one step forward. When `curr` falls off the end, `prev` is the new head. Starting `prev` at `null` is what makes the old head's `next` become `null`.

For the recursive follow-up: assume `reverseList(head.next)` already reversed everything after `head`. Where is `head.next` now, and how do you attach `head` behind it?
