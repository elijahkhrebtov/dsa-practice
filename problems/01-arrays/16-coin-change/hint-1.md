# Hint 1

Picking the biggest coin first doesn't work (`[1, 3, 4]`, amount 6). Instead, think about the **last** coin in an optimal solution: it's one of the coins `c`, and what remains, `amount - c`, must itself have been made with the fewest coins possible.

So the answer for `amount` depends on the answers for smaller amounts. Which ones?
