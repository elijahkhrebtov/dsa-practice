# Hint 1

A two-pass answer is easy: count how many 0s, 1s and 2s there are, then overwrite the array. To do it in **one** pass, think about where each value belongs as soon as you see it: 0s go to the front, 2s go to the back, and 1s end up in the middle on their own.

What if you kept a "next slot for a 0" at the left end and a "next slot for a 2" at the right end?
