# Hint 2

Binary search over the **virtual** flat array, without building it. Indices run from `0` to `m·n − 1`, and you only need a way to read the element at flat index `i`.

How do you turn `i` into a row and a column when every row holds `n` elements?
