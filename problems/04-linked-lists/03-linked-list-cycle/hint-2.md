# Hint 2

For O(1) memory: picture two runners on a track, one twice as fast as the other. On a straight road the fast one just reaches the end first. On a circular track the fast one eventually laps the slow one.

Move a `slow` pointer one step and a `fast` pointer two steps per iteration. If `fast` (or `fast.next`) becomes `null`, there's no cycle. If `slow === fast` at some point, there is. Check `fast !== null && fast.next !== null` before taking the double step.
