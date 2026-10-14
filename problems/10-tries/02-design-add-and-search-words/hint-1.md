# Hint 1

Without dots this is exactly the trie from the previous problem: follow one child per letter, then check the end-of-word flag.

What should happen when the walk reaches a `.`? Which children of the current node could the dot stand for, and how many paths might you need to try?
