# Hint 2

Turn each "x before y" rule into a directed edge `x → y` in a graph whose nodes are all the letters that appear. You now need an ordering of the nodes in which every edge points forward — a **topological sort**. It exists exactly when the graph has no cycle.

Kahn's algorithm does both jobs at once: if it can't output every letter, there was a cycle.
