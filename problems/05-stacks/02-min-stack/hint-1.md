# Hint 1

The hard part is `getMin` after a `pop`: if the minimum gets popped, how do you know what the minimum was **before** it was pushed — without scanning?

Notice that a stack only ever changes at the top. The minimum of the stack at any moment depends only on the elements at or below the top.
