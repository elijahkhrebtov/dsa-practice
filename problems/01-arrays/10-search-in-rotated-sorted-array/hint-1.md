# Hint 1

Pick any middle index `mid` and cut the array into `[lo..mid]` and `[mid..hi]`. The rotation point (where the values "drop") can only be in one of those two pieces.

So at least one of the two halves is a normal, fully sorted range. How can you tell which one by comparing just two or three values?
