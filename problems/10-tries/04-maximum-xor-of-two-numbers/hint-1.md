# Hint 1

Compare two candidate XOR results bit by bit, starting from the **most significant** bit. Whichever has a 1 at the first position where they differ is larger, no matter what the lower bits are. (1000 beats 0111.)

So for a fixed number `x`, the best partner is the one that **differs** from `x` in the highest possible bit. Among those, it's the one that differs in the next highest bit, and so on. How could you find that partner quickly, without trying every number?
