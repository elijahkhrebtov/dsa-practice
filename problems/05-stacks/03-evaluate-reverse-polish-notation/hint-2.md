# Hint 2

Use a stack of numbers. A number token gets pushed. An operator pops two values, combines them, and pushes the result back. When the tokens run out, the single value left on the stack is the answer.

Two details decide whether you pass:

- The **first** pop is the **right** operand, the second pop is the **left** one (`a - b`, not `b - a`).
- Division must truncate toward zero. `Math.floor` rounds negatives the wrong way. Look at `Math.trunc`.

Also, telling a number from an operator by its first character fails on `"-11"`. Compare the whole token to the four operator strings instead.
