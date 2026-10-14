# Hint 2

Every node must lie inside an **open interval** `(low, high)` set by its ancestors. The root may hold anything: `(-Infinity, Infinity)`.

- Going **left** from a node with value `v` keeps the lower bound and tightens the upper bound to `v`.
- Going **right** keeps the upper bound and tightens the lower bound to `v`.

A node whose value falls outside its interval (including *equal* to a bound) makes the tree invalid.
