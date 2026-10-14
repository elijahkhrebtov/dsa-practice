# Hint 1

Because of negative numbers, a sliding window doesn't work here: extending a window can make its sum smaller again.

Think about **running totals** instead. If you know the sum of the first `j` elements and the sum of the first `i` elements, what's the sum of the elements between them?
