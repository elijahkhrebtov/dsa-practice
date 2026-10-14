# Hint 3

`row = Math.floor(i / n)` and `col = i % n`, where `n` is the number of **columns** (dividing by the number of rows only works for square matrices).

Use the standard loop: `lo = 0`, `hi = m·n − 1`, and while `lo <= hi`, compare `matrix[row(mid)][col(mid)]` with the target, then return `true` or move `lo`/`hi` past `mid`. When the loop ends, return `false`.
