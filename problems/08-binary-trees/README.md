# Binary Trees

A **binary tree** is a set of nodes where every node holds a value and has at most two children, called `left` and `right`. One node — the **root** — has no parent; every other node has exactly one. There are no cycles.

Trees are the first "non-linear" structure in this collection. Almost every tree problem reduces to one question: **in what order do I visit the nodes, and what does each node need to know from its neighbours?**

## Terminology

```
            1          ← root (depth 0)
          /   \
         2     3       ← depth 1; 2 and 3 are siblings, 1 is their parent
        / \     \
       4   5     6     ← depth 2; 4, 5, 6 are leaves (no children)
          /
         7             ← depth 3
```

| Term | Meaning |
| --- | --- |
| **Leaf** | A node with no children (4, 6, 7 above). |
| **Subtree** | A node together with all of its descendants. The subtree rooted at 2 is {2, 4, 5, 7}. |
| **Depth** of a node | Number of edges from the root down to it (root = 0). |
| **Height** / max depth of a tree | Number of nodes on the longest root-to-leaf path. The tree above has height 4. (Some books count edges instead — each problem states which it wants.) |
| **Level** | All nodes with the same depth. |
| **Path** | A sequence of nodes connected by edges, each node used at most once. A path may go up and then down (4 → 2 → 5 → 7), but never through a node twice. |
| **Balanced** | Height is O(log n). Random trees are usually close to this. |
| **Degenerate / skewed** | Every node has at most one child, so the tree is really a linked list and its height is n. |
| **Complete** | Every level is full except possibly the last, which is filled from the left. |

## Representation in JavaScript

`lib/tree.js` provides the node class used by every problem in this topic:

```js
import { TreeNode } from '../../../lib/tree.js';

const root = new TreeNode(1, new TreeNode(2), new TreeNode(3));
root.val;        // 1
root.left.val;   // 2
root.right.left; // null — a missing child is always `null`
```

### How tests write trees: level-order arrays

Tests describe trees as **level-order arrays** (the LeetCode format) and convert them with `arrayToTree` / `treeToArray`. Read the array level by level, left to right; `null` means "this child is missing". Children are only listed for nodes that exist, and trailing `null`s are dropped.

```
            1
          /   \
         2     3            →   [1, 2, 3, null, 5, null, 6, 7]
          \     \
           5     6               1          root
          /                      2, 3       children of 1
         7                       null, 5    children of 2 (no left child)
                                 null, 6    children of 3 (no left child)
                                 7          left child of 5 (rest are null, trimmed)
```

Other helpers in `lib/tree.js` (handy when experimenting, used heavily by the tests):

| Helper | What it does |
| --- | --- |
| `arrayToTree(values)` | Level-order array → root (`null` for `[]`). |
| `treeToArray(root)` | Root → level-order array, trailing nulls trimmed. |
| `findNode(root, val)` | First node holding `val` (BFS order). |
| `inorderValues(root)` | In-order list of values (iterative). |
| `treeHeight(root)` | Height in nodes (iterative, safe for deep trees). |

## Traversals

### Depth-first (DFS): pre-order, in-order, post-order

DFS goes as deep as possible down one branch before backing up. The three classic orders differ only in **when the node itself is processed** relative to its subtrees:

| Order | Sequence | For the tree above | Typical use |
| --- | --- | --- | --- |
| Pre-order | node, left, right | 1 2 4 5 7 3 6 | Copy/serialize a tree, pass state from parent to child. |
| In-order | left, node, right | 4 2 7 5 1 3 6 | BSTs: visits values in sorted order. |
| Post-order | left, right, node | 4 7 5 2 6 3 1 | Compute something from the children's answers (heights, sums, deletions). |

Recursive DFS is three lines — move the `visit` line to change the order:

```js
function dfs(node) {
  if (node === null) return;
  // visit(node)  ← pre-order
  dfs(node.left);
  // visit(node)  ← in-order
  dfs(node.right);
  // visit(node)  ← post-order
}
```

Every recursive DFS can be made **iterative** with an explicit stack (an array used with `push` / `pop`):

- **Pre-order**: push the root; repeatedly pop a node, visit it, push its *right* child then its *left* child (so left is popped first).
- **In-order**: walk left from the current node, pushing every node on the way; when you can't go further, pop one, visit it, then move to its right child and repeat.
- **Post-order**: either run pre-order with "node, right, left" and reverse the output, or keep a `lastVisited` pointer so you only visit a node after its right subtree is done.

### Breadth-first (BFS): level by level

BFS visits nodes in order of depth using a **queue**. To know where one level ends and the next begins, read the queue's size at the start of each round and process exactly that many nodes:

```js
const queue = [root];
let head = 0;                        // index of the next node to dequeue
while (head < queue.length) {
  const levelEnd = queue.length;     // everything currently queued is on this level
  while (head < levelEnd) {
    const node = queue[head++];
    // visit(node)
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  // a whole level has just been processed
}
```

**JS gotcha:** `Array.prototype.shift()` is O(n) in the general case because it re-indexes the array. Advancing a `head` index instead keeps each dequeue O(1). (Alternatively, build each level into a fresh `next` array.)

## Two ways information flows

Most tree solutions follow one of two shapes — recognising which one you need is half the problem.

**Pass state down (top-down, pre-order).** The parent hands each child what it knows: the current depth, the sum of the path so far, the allowed value range. Useful when a node's answer depends on its *ancestors*.

```js
function dfs(node, depth) {
  if (!node) return;
  best = Math.max(best, depth);
  dfs(node.left, depth + 1);
  dfs(node.right, depth + 1);
}
```

**Return info up (bottom-up, post-order).** Each call returns a summary of its subtree — its height, its sum, "did I find the target?" — and the parent combines the two children's summaries. Useful when a node's answer depends on its *descendants*. This is the engine behind diameter, maximum path sum, balanced-tree checks, lowest common ancestor and tree DP (House Robber III).

```js
function height(node) {
  if (!node) return 0;
  const l = height(node.left);
  const r = height(node.right);
  // ← here you know both subtrees: update a global answer if needed
  return 1 + Math.max(l, r);
}
```

A common twist: the value you **return** to the parent differs from the value you **record** as the answer. In diameter, a node returns its height (one branch) but records `left + right` (both branches joined at this node).

## Recursion depth in JavaScript

Recursion uses the call stack, one frame per level of the tree. Node's default stack holds roughly **9,000–10,000** simple frames, so a recursive DFS throws `RangeError: Maximum call stack size exceeded` on a **degenerate tree** of a few tens of thousands of nodes — even though the same code is fine for a balanced tree of millions (depth ≈ 20).

- Problems in this topic state the maximum tree height in their constraints. When it is small (≈ 2,000 or less), recursion is fine and usually clearest.
- When a problem says the tree may be very deep (Binary Tree Inorder Traversal's follow-up test uses a 100,000-node chain), use an explicit stack or a queue.
- BFS never recurses, so it has no depth problem.

## Complexity

With n nodes and height h:

| Operation | Time | Extra space |
| --- | --- | --- |
| Any full traversal (DFS or BFS) | O(n) | — |
| Recursive or stack-based DFS | O(n) | O(h) stack: O(log n) balanced, O(n) skewed |
| BFS with a queue | O(n) | O(w), w = widest level (up to ≈ n/2 for a complete tree) |
| Find a value (unordered tree) | O(n) | O(h) or O(w) |
| Height | O(n) | O(h) |
| Build from level-order array | O(n) | O(n) |

Unlike a binary *search* tree (next topic), a plain binary tree has no ordering, so searching for a value means visiting everything.

## Patterns in this topic

- **Tree DFS** — recursive or stack-based; pre/in/post order; pass-down state or return-up summaries.
- **Tree BFS** — queue, level-size loop; anything phrased "per level", "nearest", "right side".
- **Stack** — iterative DFS.
- **Divide & Conquer** — build a tree from traversals by splitting at the root.
- **Prefix Sum** + **Hash Map** — counting downward paths with a given sum.
- **Dynamic Programming** on trees — each node returns a small tuple of answers (e.g. "best with me" / "best without me").
- **Design** — serialize a tree to a string and back.

## Problem order

| # | Problem | Difficulty | Key idea |
| --- | --- | --- | --- |
| 01 | binary-tree-inorder-traversal | Easy | DFS orders; recursion vs an explicit stack |
| 02 | maximum-depth-of-binary-tree | Easy | Return height up (DFS) or count levels (BFS) |
| 03 | invert-binary-tree | Easy | Visit every node once and swap its children |
| 04 | diameter-of-binary-tree | Easy | Return height up, record left + right at each node |
| 05 | binary-tree-level-order-traversal | Medium | BFS with a level-size loop |
| 06 | binary-tree-right-side-view | Medium | Last node of every BFS level |
| 07 | lowest-common-ancestor-of-a-binary-tree | Medium | Return "found" info up and decide at the split point |
| 08 | construct-tree-from-preorder-and-inorder | Medium | Divide & conquer around the root, index lookup in a map |
| 09 | path-sum-iii | Medium | Prefix sums along the root-to-node path |
| 10 | house-robber-iii | Medium | Tree DP: each node returns (take, skip) |
| 11 | binary-tree-maximum-path-sum | Hard | Like diameter, but with values and negative branches |
| 12 | serialize-and-deserialize-binary-tree | Hard | Encode structure (including nulls) and rebuild it |

Start with 01–04 to get comfortable with recursion and the "return info up" shape (04 is the first problem where the returned value and the recorded answer differ). 05–06 practise level-by-level BFS. The remaining problems combine these tools.
