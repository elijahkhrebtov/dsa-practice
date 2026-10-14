# Hint 2

This is **dynamic programming on a tree**. The parent doesn't just need "the best total for this subtree". It needs to know the best total **when the child is robbed** and the best total **when it isn't**, because robbing the parent rules out the first option.

What if each recursive call returned both numbers at once?
