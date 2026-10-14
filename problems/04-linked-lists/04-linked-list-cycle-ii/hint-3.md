# Hint 3

Since `a + b` is a multiple of `L`, a pointer that starts at the meeting point and walks `a` steps ends up exactly at the cycle start, possibly after a few full laps.

You don't know `a`, but you don't need to. After the meeting, put one pointer back at `head` and leave the other at the meeting node. Move both **one** step at a time. They meet at the cycle start, and you return that node. If `fast` ever runs off the end in phase one, return `null`.
