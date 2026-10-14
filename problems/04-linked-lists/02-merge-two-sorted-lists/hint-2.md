# Hint 2

Create a throwaway **dummy node** and keep a `tail` pointer that starts at it. While both lists are non-empty, attach the smaller front node to `tail.next`, advance that list, and advance `tail`.

When one list runs out, the other one is already sorted and linked, so attach the whole remainder with a single `tail.next = …`. The answer is `dummy.next`. Thanks to the dummy, an empty result needs no special case either.
