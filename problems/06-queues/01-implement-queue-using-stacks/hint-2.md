# Hint 2

Use two stacks: an **inbox** that every `push` goes to, and an **outbox** that `pop`/`peek` read from.

Only when the outbox is **empty** do you pour the entire inbox into it. While the outbox still has elements, its top is the oldest element in the queue, so leave it alone. Each element is then moved at most once, which makes every operation amortized O(1).
