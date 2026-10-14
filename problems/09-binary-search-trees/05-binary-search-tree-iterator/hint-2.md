# Hint 2

Simulate the recursion with an explicit **stack** of nodes that you've reached but haven't returned yet. Those are the "ancestors still waiting for their turn".

The smallest value is at the end of the left spine: from the root, keep going left. Push every node along the way, so the top of the stack is the next value to return. `hasNext()` is simply "is the stack non-empty?".
