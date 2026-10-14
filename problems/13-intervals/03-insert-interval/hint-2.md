# Hint 2

The three groups are three **consecutive runs**, so a single pass with one index handles them in order:

1. Copy every interval that ends **before** the new one starts (`end < newStart`).
2. Absorb every interval that starts **at or before** the new one ends (`start <= newEnd`) into a growing `[newStart, newEnd]`.
3. Append the merged interval, then copy everything that remains.
