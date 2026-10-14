# Hint 2

This is the **prefix sum** idea, with multiplication instead of addition. Build a "prefix products" array where position `i` holds the product of everything strictly before `i` (the empty product is `1`), and a matching "suffix products" array for everything strictly after `i`. Multiply them position by position.

Zeros need no special handling: they just flow through the products.
