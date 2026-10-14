# Hint 3

For the O(1)-extra-space version, use the output array itself:

1. Sweep left to right with a running product that starts at `1`. Write the running product into `answer[i]` **before** multiplying `nums[i]` into it. Now `answer[i]` holds the product of everything left of `i`.
2. Sweep right to left with a second running product that also starts at `1`. Multiply `answer[i]` by it, **then** multiply `nums[i]` into the running product.
