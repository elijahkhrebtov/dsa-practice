# Hint 2

The cost of a window is `windowLength - (count of its most frequent letter)`. That suggests a **sliding window** with a 26-slot **frequency array**:

- extend the window to the right one letter at a time, updating the counts;
- while the window is invalid (`length - maxCount > k`), shrink it from the left;
- after each step, the window is valid — record its length.
