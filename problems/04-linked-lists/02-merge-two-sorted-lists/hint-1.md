# Hint 1

The smallest value of the merged list must be the smaller of the two heads. Once you've taken that node, the problem is the same as before, just with one list a node shorter.

So the work is a loop of "compare the two fronts, take the smaller". The awkward part is the very first node: before you've picked anything, what do you attach it to?
