# Hint 2

Keep the survivors on a stack. The right end of the survivors is the top of the stack.

A right-moving asteroid never hits anything to its left, so you just push it. A left-moving asteroid only collides while the top of the stack is a **right-mover**. Compare it with the top again and again: pop smaller tops and keep going, stop if the top is bigger, and pop the top and stop if they're equal. Push it only if it survives. Make sure you handle all three outcomes, including the tie.
