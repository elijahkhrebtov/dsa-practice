# Hint 3

1. For each pair `[a, b]`: push `a` into `next[b]` and increment `indegree[a]`.
2. Push every course with `indegree === 0` into an array that serves as both the queue (with a head index) and the output order.
3. Walk the array with the head index. For each course, decrement `indegree` of every course it unlocks, and append the ones that drop to 0.
4. At the end, if the array has all `numCourses` courses, return it. Otherwise return `[]`, because the leftover courses are stuck on a cycle.
