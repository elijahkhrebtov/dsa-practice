# Hint 1

When you're reading the inside of `3[a2[c]]` and reach the inner `]`, you know `"c"` has to be repeated 2 times. But what then? The result has to be glued onto the `"a"` you were building *before* the inner group started, and that combined string has to wait for the outer `]`.

Every `[` pauses the work at the current level and starts a new one. Every `]` finishes the most recently started level. Which data structure fits that order?
