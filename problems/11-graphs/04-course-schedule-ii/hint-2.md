# Hint 2

You're looking for a **topological order**. Kahn's algorithm builds one directly: keep each course's **in-degree** (prerequisites not yet taken), start a queue with every in-degree-0 course, and record courses in the order you dequeue them.

How can you tell at the end that a cycle prevented some courses from ever being dequeued?
