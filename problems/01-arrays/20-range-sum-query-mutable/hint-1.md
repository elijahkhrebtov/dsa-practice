# Hint 1

A plain array makes `sumRange` slow; a prefix-sum array makes `update` slow, because changing one element shifts every prefix after it.

What if you precomputed sums of **blocks** instead of single elements or whole prefixes — chosen so that each element sits in only a few blocks, and any range can be built from only a few blocks?
