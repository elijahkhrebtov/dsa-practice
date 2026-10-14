# Hint 1

Every candidate rectangle has a shortest bar that limits its height. So flip the question around: for each bar `i`, what is the widest rectangle whose height is exactly `heights[i]`?

It reaches left and right until it hits a bar that is **strictly shorter** than `heights[i]`. If you knew, for every bar, the nearest shorter bar on each side, the answer would be a simple maximum.
