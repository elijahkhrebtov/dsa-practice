# Hint 1

The natural recursion is "either rob this house and continue from the grandchildren, or skip it and continue from the children". It gives the right answers, but count how many times a grandchild's subtree gets solved: once directly from the node, and again from the child. What happens to that duplication over 40 levels?
