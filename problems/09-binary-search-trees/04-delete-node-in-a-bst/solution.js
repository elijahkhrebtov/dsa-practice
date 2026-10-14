/*
 * Title:      Delete Node in a BST
 * Difficulty: Medium
 * Patterns:   BST Property
 *
 * Solution — Delete Node in a BST
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Locating the node is ordinary BST search, O(h). Removing it splits into
 * three cases by number of children:
 *
 *   • 0 children: just drop it (its parent now points to null).
 *   • 1 child: the child's whole subtree already lies on the correct side
 *     of the parent, so the child can take the deleted node's place.
 *   • 2 children: we need a replacement value that is larger than
 *     everything on the left and smaller than everything on the right. The
 *     in-order successor (the smallest value in the right subtree) is
 *     exactly that. Copy it into the node, then delete the successor from
 *     the right subtree. The successor is a leftmost node, so it has no
 *     left child, and that second deletion is always a 0- or 1-child case.
 *
 * Writing it recursively as "return the new root of this subtree" makes
 * relinking automatic: every parent assigns the returned subtree back into
 * its left/right pointer, and the top-level call may return a different
 * root.
 *
 * Approach
 * ────────
 *   deleteNode(node, key):
 *     1. node is null → return null (key not in the tree).
 *     2. key < node.val → node.left  = deleteNode(node.left, key); return node.
 *        key > node.val → node.right = deleteNode(node.right, key); return node.
 *     3. Found:
 *          a. no left child  → return node.right
 *          b. no right child → return node.left
 *          c. succ = leftmost node of node.right
 *             node.val = succ.val
 *             node.right = deleteNode(node.right, succ.val)
 *             return node
 *
 * Walkthrough — root = [5, 3, 6, 2, 4, null, 7], key = 3
 * ───────────
 *   at 5: 3 < 5 → recurse left
 *   at 3: found, two children (2 and 4)
 *         successor = leftmost of right subtree (4) = 4
 *         copy 4 into this node, delete 4 from its right subtree
 *           at 4: found, no left child → return its right (null)
 *         node (now 4).right = null
 *   5.left = node(4)
 *   Result: [5, 4, 6, 2, null, null, 7]
 *
 * Complexity
 * ──────────
 *   Time:  O(h): one path down to the key, then at most one more path down
 *          to the successor (which continues in the same direction).
 *   Space: O(h) recursion. An iterative version with a parent pointer
 *          gets O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Predecessor instead of successor (the rightmost node of the left
 *     subtree) is equally correct, and gives a different but valid shape.
 *   • Relinking instead of copying values: splice the successor out
 *     (successor's parent takes the successor's right child) and put the
 *     successor node itself in the deleted node's place. That's useful when
 *     nodes carry extra data, or when outside code holds references to them.
 *   • Another valid but unbalanced trick: hang the deleted node's left
 *     subtree under the leftmost node of its right subtree and return the
 *     right subtree. Correct, but it can make the tree much taller.
 *   • Forgetting to assign the recursive result back (`node.left = …`) is
 *     the classic bug: the deletion happens in a detached copy of the path.
 *   • Deleting the root must return the NEW root. Callers use the return
 *     value, not the old `root` variable.
 *   • Flattening to a sorted array, removing the key and rebuilding is O(n)
 *     per deletion and creates new nodes.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @param {number} key
 * @returns {TreeNode | null}
 */
export function deleteNode(root, key) {
  if (root === null) return null; // key not found (or empty tree)

  if (key < root.val) {
    root.left = deleteNode(root.left, key); // relink whatever the subtree becomes
    return root;
  }
  if (key > root.val) {
    root.right = deleteNode(root.right, key);
    return root;
  }

  // Found the node to delete.
  if (root.left === null) return root.right; // 0 or 1 child (right or none)
  if (root.right === null) return root.left; // exactly 1 child (left)

  // Two children: replace with the in-order successor (leftmost in the right subtree).
  let succ = root.right;
  while (succ.left !== null) succ = succ.left;
  root.val = succ.val;
  root.right = deleteNode(root.right, succ.val); // successor has no left child → easy case
  return root;
}
