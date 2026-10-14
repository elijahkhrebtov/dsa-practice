# Tries

A **trie** (pronounced "try", from re*trie*val), also called a **prefix tree**, is a tree that stores a set of strings character by character. Each edge is labelled with a character, and each node stands for the **prefix** spelled by the path from the root to it. Words that share a prefix share the nodes for that prefix.

Words `car`, `cat`, `cart`, `dog`:

```
            (root)
            /    \
           c      d
           |      |
           a      o
          / \     |
         r*  t*   g*
         |
         t*

   * = "a word ends here"
```

The `*` matters. `car` and `cart` are both stored, but `ca` is not a word even though its node exists. Every node needs an **end-of-word flag**, because "this node exists" only means "some word starts with this prefix".

## Tries in JavaScript

JavaScript has no built-in trie, but a node is tiny:

```js
class TrieNode {
  constructor() {
    this.children = new Map(); // char → TrieNode
    this.isEnd = false;        // does a word end exactly here?
  }
}
```

Insert walks down from the root and creates missing children along the way. Search walks down and fails as soon as a child is missing:

```js
insert(word) {
  let node = this.root;
  for (const ch of word) {
    if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
    node = node.children.get(ch);
  }
  node.isEnd = true;
}
```

Many problems store extra data on the node instead of (or in addition to) `isEnd`. Examples are the word itself (handy in Word Search II), a count of words passing through, or a short list of suggestions.

### Representing `children`: trade-offs

| Representation | Lookup | Memory per node | Notes |
| --- | --- | --- | --- |
| `Map` | O(1) average | proportional to the number of children | any alphabet; clean API; iteration order = insertion order |
| plain object `{}` | O(1) average | proportional to the number of children | works, but watch for keys like `"__proto__"`; use `Object.create(null)` |
| array of 26 (`new Array(26)`) | O(1), index `code - 97` | always 26 slots | fastest for lowercase a–z; iterating 0..25 gives **alphabetical order** for free |
| array of 2 | O(1) | 2 slots | **binary trie** over the bits of integers |

Memory is a trie's main weakness. With many long words that share little, you create one node per character. An array-of-26 node wastes most of its slots when it's sparse. A `Map` node has its own overhead, but only for the children it actually has. For lowercase-only interview problems, either is fine. Pick the array when you need sorted traversal or raw speed.

## Complexity

Let `L` be the length of the word or prefix, and `N` the total number of characters inserted.

| Operation | Time | Notes |
| --- | --- | --- |
| insert(word) | O(L) | at most L new nodes |
| search(word) | O(L) | then check `isEnd` |
| startsWith(prefix) | O(L) | the node existing is enough |
| delete(word) | O(L) | unset `isEnd`; optionally prune empty nodes on the way back up |
| list all words with a prefix | O(L + size of that subtree) | DFS below the prefix node |
| Space | O(N) nodes (worst case) | shared prefixes reduce it |

Compare with a `Set` of words. `set.has(word)` is also O(L) (hashing reads the whole string), but a `Set` can't answer "does any word start with `pre`?" without scanning every word. A trie answers that in O(L). This prefix sharing is the reason to reach for one.

## Binary tries for XOR problems

Treat each integer as a 31-bit (or 32-bit) string, **most significant bit first**, and insert it into a trie with two children per node (0 and 1). To find the number that maximizes `x XOR y` for a given `x`, walk down from the top bit and at each level try to take the child with the **opposite** bit. A 1 in a higher bit beats any combination of lower bits, so this greedy choice is optimal. Each query costs O(31).

JS gotcha: bitwise operators work on **signed 32-bit** integers. `(x >> i) & 1` is fine for `i < 31`. A value with bit 31 set comes out negative, and `>>> 0` turns it back into an unsigned number. Building results with `res | (1 << 30)` is safe, but `1 << 31` is negative.

## Patterns in this topic

- **Trie**: prefix lookups, autocomplete, many-word matching.
- **Design**: wrap the trie in a class with a fixed API.
- **Recursion** / **Backtracking**: wildcard search tries several branches, and Word Search II runs a DFS over a grid while walking the trie in step.
- **Sorting**: lexicographic order of suggestions (or let an array-of-26 trie give it to you).
- **Bit Manipulation**: binary tries over the bits of integers.
- **Matrix Traversal**: grid DFS combined with a trie.

## Problem order

1. **Implement Trie (Prefix Tree)** (Medium): the core structure, with `insert` / `search` / `startsWith`.
2. **Design Add and Search Words Data Structure** (Medium): trie plus DFS branching on a `.` wildcard.
3. **Search Suggestions System** (Medium): autocomplete with the 3 lexicographically smallest matches per prefix.
4. **Maximum XOR of Two Numbers in an Array** (Medium): binary trie with a greedy walk, bit by bit.
5. **Word Search II** (Hard): one grid DFS that follows a trie of all the words at once.
