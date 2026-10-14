# Hint 3

For each price `p`, compute the new values from yesterday's (use temporaries so you don't mix old and new):

- new `hold` = the better of keeping yesterday's share, or buying today — and you can only buy from `rest`, never from `sold`.
- new `sold` = yesterday's `hold` plus `p`.
- new `rest` = the better of yesterday's `rest` and yesterday's `sold` (the cooldown day passes).

Start with `hold = -Infinity` (you can't own a share before day 0), `sold = rest = 0`. The answer is the larger of `sold` and `rest` at the end.
