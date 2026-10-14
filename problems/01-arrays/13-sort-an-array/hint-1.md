# Hint 1

The simple sorts you may know first (bubble, insertion, selection) compare neighbouring elements or scan the rest of the array for every position — that's O(n²), about 5·10^9 steps for 100,000 numbers.

To beat that, you need an algorithm where each element takes part in only about `log n` "rounds" of work. Which sorting algorithms split the problem in halves?
