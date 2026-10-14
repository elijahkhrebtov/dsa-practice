# Hint 1

You don't need the whole array sorted. You only need the minimum to be easy to find **and** cheap to restore after a change.

What if every element only had to be `<=` the (at most two) elements "below" it? Where would the minimum end up? And how many elements would a single insertion or removal actually disturb?
