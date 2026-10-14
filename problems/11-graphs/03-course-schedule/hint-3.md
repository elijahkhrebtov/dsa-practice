# Hint 3

Kahn's algorithm:

1. Build an adjacency list `next[b]` (courses that `b` unlocks) and an `indegree[a]` count of prerequisites for each course.
2. Queue every course whose in-degree is 0.
3. Pop a course and count it as taken. For each course it unlocks, decrement that course's in-degree, and queue it when it reaches 0.
4. When the queue runs dry, you can finish everything only if you took all `numCourses` courses. Courses on a cycle never reach in-degree 0.
