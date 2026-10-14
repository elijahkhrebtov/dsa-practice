# Hint 2

Walk the prices once, left to right, carrying two numbers:

- `minPrice` — the cheapest price seen so far (the best possible buy day up to now),
- `best` — the best profit found so far (start at 0, which means "don't trade").

For each price, first see whether selling today (`price - minPrice`) beats `best`, then see whether today is a new cheapest buy day. You never need to remember *which* days they were.
