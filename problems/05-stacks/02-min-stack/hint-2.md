# Hint 2

Remember the answer to "what is the minimum?" for **every height** of the stack.

When you push `val`, also record `min(val, currentMin)` — either in a second stack that moves in lockstep with the first, or by pushing `[val, minSoFar]` pairs. Popping then automatically "rewinds" the minimum to what it was.
