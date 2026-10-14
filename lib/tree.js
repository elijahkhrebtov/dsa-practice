/**
 * Binary tree helpers shared by problems and tests.
 *
 * Trees are written in tests as level-order arrays (LeetCode style), where
 * `null` marks a missing child:
 *
 *        3
 *       / \
 *      9   20          →   [3, 9, 20, null, null, 15, 7]
 *          / \
 *         15  7
 *
 * You can import these in your solutions:
 *   import { TreeNode } from '../../../lib/tree.js';
 */

/** A node of a binary tree. */
export class TreeNode {
  /**
   * @param {number} [val=0] - Value stored in the node.
   * @param {TreeNode | null} [left=null] - Left child.
   * @param {TreeNode | null} [right=null] - Right child.
   */
  constructor(val = 0, left = null, right = null) {
    /** @type {number} */
    this.val = val;
    /** @type {TreeNode | null} */
    this.left = left;
    /** @type {TreeNode | null} */
    this.right = right;
  }
}

/**
 * Builds a binary tree from a level-order array with `null` gaps.
 *
 * @param {Array<number | null>} values - Level-order values.
 * @returns {TreeNode | null} Root of the tree (null for an empty array or `[null]`).
 */
export function arrayToTree(values) {
  if (values.length === 0 || values[0] === null || values[0] === undefined) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let head = 0;
  let i = 1;
  while (head < queue.length && i < values.length) {
    const node = queue[head++];
    if (i < values.length && values[i] !== null && values[i] !== undefined) {
      node.left = new TreeNode(/** @type {number} */ (values[i]));
      queue.push(node.left);
    }
    i++;
    if (i < values.length && values[i] !== null && values[i] !== undefined) {
      node.right = new TreeNode(/** @type {number} */ (values[i]));
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

/**
 * Serializes a binary tree into a level-order array with `null` gaps
 * (trailing nulls are trimmed), the inverse of `arrayToTree`.
 *
 * @param {TreeNode | null} root - Root of the tree.
 * @returns {Array<number | null>} Level-order values.
 */
export function treeToArray(root) {
  if (!root) return [];
  const out = [];
  const queue = [root];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    if (queue.length > 2_000_000) throw new Error('treeToArray: tree too large — does it contain a cycle?');
    if (node === null) {
      out.push(null);
      continue;
    }
    out.push(node.val);
    queue.push(node.left, node.right);
  }
  while (out.length > 0 && out[out.length - 1] === null) out.pop();
  return out;
}

/**
 * Finds the first node (BFS order) holding `val`.
 *
 * @param {TreeNode | null} root - Root of the tree.
 * @param {number} val - Value to look for.
 * @returns {TreeNode | null} The node, or null if absent.
 */
export function findNode(root, val) {
  const queue = root ? [root] : [];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    if (node.val === val) return node;
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return null;
}

/**
 * Returns the in-order sequence of values (left, node, right).
 *
 * @param {TreeNode | null} root - Root of the tree.
 * @returns {number[]} Values in in-order sequence.
 */
export function inorderValues(root) {
  const out = [];
  const stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop();
    out.push(node.val);
    node = node.right;
  }
  return out;
}

/**
 * Height of the tree in nodes (empty tree = 0). Iterative, safe for deep trees.
 *
 * @param {TreeNode | null} root - Root of the tree.
 * @returns {number} Number of nodes on the longest root-to-leaf path.
 */
export function treeHeight(root) {
  if (!root) return 0;
  let height = 0;
  let level = [root];
  while (level.length) {
    height++;
    const next = [];
    for (const n of level) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    level = next;
  }
  return height;
}
