# Hint 2

You are detecting a **cycle in a directed graph**, which is the same as asking whether a **topological order** exists.

Two standard ways: **Kahn's algorithm** (repeatedly take a course with no remaining prerequisites, i.e. in-degree 0), or **DFS with three states** (unvisited / on the current path / finished). Keep in mind that one test is a chain of 20,000 courses, so a recursive DFS will overflow the stack.
