# Hint 1

Picture the array as a circle. If the front of the queue is at index `head` and the queue holds `count` elements, which index holds the rear element, and where does the next element go? What happens to those indices once they run past `k - 1`?

Also: with only `head` and a `tail` index, a full queue and an empty queue can look identical (`head === tail`). What extra piece of information gets rid of that ambiguity?
