# Hint 1

Copying `val` and `next` is easy: walk the list and create new nodes. The `random` pointers are the hard part, because when you copy node X, `X.random` may point to a node whose copy doesn't exist yet. And even if it does exist, how do you find it?

What you really need is a quick answer to "given an original node, which new node is its copy?"
