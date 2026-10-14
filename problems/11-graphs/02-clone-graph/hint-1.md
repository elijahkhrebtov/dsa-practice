# Hint 1

Copying a tree is "copy the node, then copy its children". Try that on the two-node graph `1 ⇄ 2` and you'll recurse forever. On a diamond (`1-2`, `1-3`, `2-4`, `3-4`) you'd also create node 4 twice.

What single piece of information would let you say "I've already made a copy of this node — here it is"?
