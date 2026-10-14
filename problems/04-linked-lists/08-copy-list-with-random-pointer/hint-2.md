# Hint 2

Use a `Map` from **original node → copy node**. JavaScript `Map`s can use objects as keys and compare them by identity.

Pass 1: walk the original list and create a copy of every node (value only), storing `map.set(original, copy)`.
Pass 2: walk again and wire up `copy.next = map.get(original.next)` and `copy.random = map.get(original.random)`. Watch out for `null`: `map.get(null)` is `undefined`, not `null`.
