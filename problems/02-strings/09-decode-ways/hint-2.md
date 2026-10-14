# Hint 2

This is **dynamic programming** over prefix lengths, and the recurrence looks a lot like Fibonacci: `ways(i)` is built from `ways(i-1)` and `ways(i-2)`.

The difference from Fibonacci is that each of the two terms only counts when its piece is a valid code. The single digit must not be `'0'`, and the two digits must form a number from 10 to 26. That range already rules out `"06"`.
