# Hint 2

Start from the ocean and walk the flow **backwards**: from a cell you may step to a neighbour whose height is **greater than or equal to** yours (water could have flowed down from it to you).

Do one multi-source graph search seeded with the whole top row + left column (Pacific), and another seeded with the bottom row + right column (Atlantic). Each marks its own visited grid. The answer is every cell marked by both.

Use an explicit stack (or a queue) rather than recursion — a big flat plateau would make a recursive DFS tens of thousands of calls deep.
