# Binary Search Trees

A **binary search tree (BST)** is a binary tree with an ordering rule. For **every** node:

- every value in its **left subtree** is smaller than the node's value, and
- every value in its **right subtree** is larger.

```
          8
        /   \
       3     10
      / \      \
     1   6      14
        / \     /
       4   7   13
```

The rule is about the **whole subtree**, not just the two children. This tree is *not* a BST, even though every parent/child pair looks fine:

```
        5
       / \
      4   6
         / \
        3   7      ← 3 is in 5's RIGHT subtree, so it must be > 5
```

Checking only `left.val < node.val < right.val` misses this "grandchild violation". It is the most common BST bug, and problem 02 is built around it.

Unless a problem says otherwise, the problems here use **strict** ordering, so duplicates are not allowed. (Some textbooks allow `<=` on one side. Always check which convention a problem uses.)

## BSTs in JavaScript

A BST uses the same `TreeNode` as any binary tree (`lib/tree.js`):

```js
import { TreeNode, arrayToTree, inorderValues } from '../../../lib/tree.js';

const root = arrayToTree([8, 3, 10, 1, 6, null, 14]);
inorderValues(root); // [1, 3, 6, 8, 10, 14]   ← sorted!
```

Tests write trees as LeetCode-style level-order arrays, with `null` for missing children.

## The key fact: in-order traversal is sorted

An in-order traversal visits left subtree, then node, then right subtree. In a BST, everything on the left is smaller and everything on the right is larger, so **an in-order traversal yields the values in ascending order**. A tree is a valid BST *exactly when* its in-order sequence is strictly increasing.

That one fact powers a lot of problems:

- "k-th smallest" means "stop the in-order walk after k nodes" (problem 03).
- "Is it a BST?" becomes "is each in-order value bigger than the previous one?" (problem 02).
- "Iterate the BST in order, lazily" becomes an in-order walk paused on an explicit stack (problem 05).
- Going the other way, a sorted array becomes a balanced BST by picking the middle element as the root (problem 01).

## Operations and their cost

Search, insert and delete each walk **one root-to-leaf path**. At every node you compare with the target and go left or right, so they cost O(h), where `h` is the tree's height.

| Operation | Balanced (h ≈ log n) | Skewed (h = n) | Notes |
| --- | --- | --- | --- |
| Search | O(log n) | O(n) | go left if smaller, right if larger |
| Insert | O(log n) | O(n) | search for the value, attach a new leaf where you fall off |
| Delete | O(log n) | O(n) | three cases, see below |
| Min / max | O(log n) | O(n) | leftmost / rightmost node |
| In-order traversal | O(n) | O(n) | sorted output |
| Successor of a node | O(log n) | O(n) | leftmost node of the right subtree (or an ancestor) |

**Skewed trees are the trap.** Inserting already-sorted values (1, 2, 3, …) into a plain BST produces a "linked list" leaning to one side, with height n. Every operation becomes O(n), and **recursion depth becomes n too**. A recursive DFS on a 100,000-node skewed tree can overflow the call stack in JavaScript. When a test uses a deep tree, prefer an explicit stack.

### Deleting a node: three cases

1. **Leaf**: just remove it (the parent's pointer becomes `null`).
2. **One child**: replace the node with its child.
3. **Two children**: find the **in-order successor** (the smallest value in the right subtree) or the predecessor. Copy its value into the node, then delete the successor from the right subtree. The successor has no left child, so that second delete is case 1 or 2.

Problem 04 asks you to implement this.

## Balancing

Plain BSTs give no height guarantee. **Self-balancing** BSTs (AVL trees, red-black trees, treaps, B-trees on disk) rotate nodes during insert and delete so that h stays O(log n) whatever order the values arrive in. Java's `TreeMap` and C++'s `std::map` are red-black trees.

**JavaScript has no built-in sorted map or set.** `Map` and `Set` remember insertion order, not sorted order. In interviews you're rarely asked to write a red-black tree. When you need "sorted container" behaviour in JS, the usual fallbacks are:

- a sorted array plus binary search (O(log n) lookup, O(n) insert, often fast enough),
- a heap, when you only need the min or max,
- writing a small BST or treap yourself, if the problem really needs it.

## Patterns in this topic

- **BST Property**: use the ordering to prune: go left or right instead of exploring both sides. It also carries `(low, high)` bounds down the tree.
- **Tree DFS**: in-order traversal, recursive or with an explicit stack.
- **Divide & Conquer**: build a balanced tree by splitting a sorted range at its middle.
- **Stack** / **Design**: turn a recursive traversal into a pausable iterator.

## Problem order

1. **Convert Sorted Array to Binary Search Tree** (Easy): middle element as root, recurse on each half.
2. **Validate Binary Search Tree** (Medium): the whole-subtree rule, using min/max bounds or an in-order check.
3. **Kth Smallest Element in a BST** (Medium): in-order traversal with an early stop.
4. **Delete Node in a BST** (Medium): the three deletion cases and the in-order successor.
5. **Binary Search Tree Iterator** (Medium): in-order traversal paused on an explicit stack, O(h) memory.
