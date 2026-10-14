# Hint 2

Keep a `color` array (e.g. `-1` = not visited yet, `0` / `1` = the two colours) and run a **BFS** that hands each newly discovered neighbour the opposite colour of the node it was discovered from.

When you look at a neighbour that is already coloured, compare: same colour as the current node → odd cycle → return `false`.

Wrap the BFS in a loop over **every** node: whenever you find one that is still uncoloured, it starts a new connected piece — colour it `0` and BFS from it. Only after all pieces pass is the answer `true`. (Use an index pointer into the queue array instead of `shift()`.)
