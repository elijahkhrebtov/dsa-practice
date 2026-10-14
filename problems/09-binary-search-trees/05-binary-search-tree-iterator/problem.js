/*
 * Title:      Binary Search Tree Iterator
 * Difficulty: Medium
 * Patterns:   Design, Stack, BST Property
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Implement an iterator that walks a binary search tree in ascending order
 * (an in-order traversal), one value at a time.
 *
 * Implement the `BSTIterator` class:
 *
 *   • new BSTIterator(root)   creates an iterator over the BST rooted at
 *                             `root` (which may be `null` for an empty tree).
 *   • next()                  returns the next smallest value and moves the
 *                             iterator forward. The first call returns the
 *                             minimum.
 *   • hasNext()               returns `true` if there are values left, and
 *                             `false` otherwise. It never moves the iterator.
 *
 * `next()` is only called when `hasNext()` would return `true`. The tree has
 * distinct values and is not modified while being iterated. Your iterator
 * must not modify it either. Several iterators over the same tree must work
 * independently.
 *
 * Trees in examples are written as level-order arrays, with `null` for a
 * missing child.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   root = [7, 3, 15, null, null, 9, 20]
 *
 *                7
 *               / \
 *              3   15
 *                 /  \
 *                9    20
 *
 *   const it = new BSTIterator(root);
 *   it.next();     // 3
 *   it.next();     // 7
 *   it.hasNext();  // true
 *   it.next();     // 9
 *   it.hasNext();  // true
 *   it.next();     // 15
 *   it.hasNext();  // true
 *   it.next();     // 20
 *   it.hasNext();  // false
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 2 * 10^5
 *   • -10^9 <= Node.val <= 10^9, all values distinct
 *   • Trees can be completely skewed, for example a chain of 100,000 nodes.
 *     Deep recursion would overflow the call stack, so use loops.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   next() and hasNext() in amortized O(1) time, using O(h) memory, where h
 *   is the tree's height. Copying all n values into an array up front works
 *   and is fast, but uses O(n) memory. Try to keep only O(h) nodes at a
 *   time.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve binary-search-tree-iterator
// ⟳ Watch mode:  npm run watch binary-search-tree-iterator

/**
 * In-order (ascending) iterator over a binary search tree.
 */
export class BSTIterator {
  /**
   * Creates an iterator positioned before the smallest value.
   *
   * @param {TreeNode | null} root - Root of the BST to iterate (may be null; not modified).
   */
  constructor(root) {
    // Your code here
  }

  /**
   * Returns the next smallest value and advances the iterator. Only called when `hasNext()` is true.
   *
   * @returns {number} The next value in ascending order.
   */
  next() {
    // Your code here
  }

  /**
   * Reports whether there are values left to return, without advancing.
   *
   * @returns {boolean} `true` if a following call to `next()` would return a value.
   */
  hasNext() {
    // Your code here
  }
}
