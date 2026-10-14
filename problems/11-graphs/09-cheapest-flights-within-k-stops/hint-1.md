# Hint 1

Work through Example 3 with ordinary Dijkstra (always expand the cheapest city, finalize it, never look at it again). Where does it go wrong?

The trouble is that "how good is this way of reaching city X?" now has **two** dimensions: the price so far *and* the number of flights used. A pricier arrival that used fewer flights can still be the one that matters.
