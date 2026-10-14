/*
 * Title:      Binary Search Tree Iterator
 * Difficulty: Medium
 * Patterns:   Design, Stack, BST Property
 *
 * Solution — Binary Search Tree Iterator
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Ascending order in a BST is in-order traversal. The recursive traversal
 * keeps its state on the call stack: the chain of ancestors whose left
 * subtree we're inside and whose own value is still pending. If we keep
 * that chain on our OWN stack, we can stop after any value and pick up
 * later. That's exactly an iterator.
 *
 * Invariant: the stack holds the nodes whose values are still to come and
 * whose left subtrees have already been fully pushed or visited. The top
 * is always the next smallest value.
 *
 * Approach (controlled in-order traversal)
 * ─────────────────────────────────────────
 *   pushLeft(node): while node is not null, push it and move to node.left.
 *
 *   constructor(root): stack = []; pushLeft(root)  (smallest value ends on top)
 *   next():   node = stack.pop()
 *             pushLeft(node.right)  (its right subtree comes next in order)
 *             return node.val
 *   hasNext(): stack.length > 0
 *
 * Walkthrough — root = [7, 3, 15, null, null, 9, 20]
 * ───────────
 *   ctor      pushLeft(7) → stack [7, 3]
 *   next()    pop 3, pushLeft(null)         → stack [7]        returns 3
 *   next()    pop 7, pushLeft(15) → 15, 9   → stack [15, 9]    returns 7
 *   next()    pop 9                          → stack [15]       returns 9
 *   next()    pop 15, pushLeft(20)           → stack [20]       returns 15
 *   next()    pop 20                         → stack []         returns 20
 *   hasNext() → false
 *
 * Complexity
 * ──────────
 *   Time:  Amortized O(1) per call. Over a full iteration every node is
 *          pushed once and popped once, so n calls cost O(n) in total. A
 *          single next() can cost O(h) when it pushes a long left spine.
 *          hasNext() is O(1).
 *   Space: O(h). The stack only ever holds part of one root-to-leaf path
 *          (the pending ancestors), never more than h nodes.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Flatten up front: do a full in-order traversal into an array in the
 *     constructor and hand out arr[i++]. O(1) per call, but O(n) memory and
 *     O(n) work even if the caller only wants the first few values.
 *   • Recursive flattening overflows the call stack on a 100,000-node chain.
 *     The explicit stack has no such limit.
 *   • A generator (`function*` with `yield*` for the subtrees) is elegant,
 *     but a recursive generator nests one generator per level, so it's deep
 *     on skewed trees, and each value travels up the chain (O(h) per value).
 *   • Morris traversal gets O(1) extra space by temporarily threading
 *     right pointers, but that modifies the tree mid-iteration, which this
 *     problem forbids.
 *   • hasNext() must not advance. Keep the "move forward" logic only in
 *     next().
 */

import { TreeNode } from '../../../lib/tree.js';

export class BSTIterator {
  /** @param {TreeNode | null} root */
  constructor(root) {
    /** @type {TreeNode[]} pending ancestors; the top is the next smallest value */
    this.stack = [];
    this.pushLeft(root);
  }

  /**
   * Pushes `node` and its entire left spine, so the leftmost (smallest) ends on top.
   * @param {TreeNode | null} node
   */
  pushLeft(node) {
    while (node !== null) {
      this.stack.push(node);
      node = node.left;
    }
  }

  /** @returns {number} */
  next() {
    const node = this.stack.pop();
    this.pushLeft(node.right); // the right subtree's values come next, smallest first
    return node.val;
  }

  /** @returns {boolean} */
  hasNext() {
    return this.stack.length > 0;
  }
}
