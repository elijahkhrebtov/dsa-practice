# Hint 3

Search `k` in `[1, max(piles)]` — the largest pile is always fast enough because `h >= piles.length`.

- `hours(k)` = sum of `Math.ceil(p / k)` over all piles (you can stop early once it exceeds `h`).
- While `lo < hi`: take `mid`; if `hours(mid) <= h`, the answer is `mid` or smaller → `hi = mid`; otherwise `lo = mid + 1`.
- When the loop ends, `lo === hi` is the minimum feasible speed.

Using `hi = mid` (not `mid - 1`) keeps a feasible speed inside the range, so you never skip past the answer.
