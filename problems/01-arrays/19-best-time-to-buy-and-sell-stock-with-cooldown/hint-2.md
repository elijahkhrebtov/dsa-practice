# Hint 2

Use **dynamic programming over a small state machine** with three states, each storing "the best profit achievable by the end of day i if I'm in this state":

- `hold` — I own a share.
- `sold` — I sold a share today (so tomorrow I may not buy).
- `rest` — I own nothing and I'm free to buy tomorrow.

Draw the arrows between states (buy, sell, wait) and note which transitions the cooldown removes.
