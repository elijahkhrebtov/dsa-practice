/*
 * Title:      Construct Binary Tree from Preorder and Inorder Traversal
 * Difficulty: Medium
 * Patterns:   Divide & Conquer, Hash Map
 *
 * Solution — Construct Binary Tree from Preorder and Inorder Traversal
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The two traversals give complementary information:
 *
 *   • preorder tells you WHO the root is: the first value of any subtree's
 *     preorder block is that subtree's root.
 *   • inorder tells you HOW TO SPLIT: in a subtree's inorder block,
 *     everything left of the root belongs to the left subtree and
 *     everything right of it to the right subtree.
 *
 * So: take the root from preorder, find it in inorder, and recurse on the
 * two halves. That's divide & conquer. The only expensive step is "find it
 * in inorder" — a hash map from value → inorder index makes it O(1)
 * (values are distinct, so the map is well defined).
 *
 * A second trick avoids computing preorder ranges at all: preorder is
 * "root, then the entire left subtree, then the entire right subtree". If
 * we build the left subtree completely before the right one, the next
 * unused preorder value is always the root of whatever subtree we are about
 * to build. A single moving pointer into preorder is enough.
 *
 * Approach
 * ────────
 *   1. Build `pos`: Map value → index in inorder.
 *   2. Keep `next = 0`, the index of the next unused preorder value.
 *   3. build(lo, hi) creates the subtree whose inorder values are
 *      inorder[lo..hi]:
 *        a. if lo > hi → null (empty range);
 *        b. val = preorder[next++]; mid = pos.get(val);
 *        c. node.left  = build(lo, mid - 1)   ← must come first
 *           node.right = build(mid + 1, hi)
 *   4. Return build(0, n - 1).
 *
 * Walkthrough — preorder [3, 9, 20, 15, 7], inorder [9, 3, 15, 20, 7]
 * ───────────
 *   pos = {9:0, 3:1, 15:2, 20:3, 7:4}
 *   build(0,4): root 3 (next→1), mid 1
 *     build(0,0): root 9 (next→2), mid 0 → left build(0,-1)=null,
 *                                         right build(1,0)=null
 *     build(2,4): root 20 (next→3), mid 3
 *       build(2,2): root 15 (next→4) → leaf
 *       build(4,4): root 7  (next→5) → leaf
 *   Result: [3, 9, 20, null, null, 15, 7]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — building the map is O(n) and each node is created once
 *          with O(1) work.
 *   Space: O(n) for the map, plus O(h) recursion stack.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Textbook version: `inorder.indexOf(root)` + `slice()` for the four
 *     sub-arrays. Correct, but each level copies arrays and scans for the
 *     root: O(n·h) time and memory, which is O(n²) on skewed trees. Using
 *     indexOf over the WHOLE inorder array is O(n²) even for balanced trees.
 *   • Passing explicit preorder ranges (preLo, preHi) also works: the left
 *     subtree has size `mid - lo`, so it occupies preorder[preLo + 1 ..
 *     preLo + size]. The moving pointer just saves the arithmetic.
 *   • Building the right subtree before the left one breaks the moving
 *     pointer trick (it would then need to walk preorder from the end, the
 *     way the postorder variant of this problem does).
 *   • Beware `if (!mid)` or `pos.get(v) || …`: index 0 and value 0 are falsy.
 *   • An iterative stack-based O(n) construction exists, but it's harder to
 *     reason about; the recursive version is the one to know.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @returns {TreeNode | null}
 */
export function buildTree(preorder, inorder) {
  // value → its index in inorder, so each root is located in O(1).
  const pos = new Map();
  for (let i = 0; i < inorder.length; i++) pos.set(inorder[i], i);

  let next = 0; // next unused preorder value = root of the next subtree we build

  /** Builds the subtree whose inorder values are inorder[lo..hi]. */
  function build(lo, hi) {
    if (lo > hi) return null; // empty range → no subtree

    const val = preorder[next++];
    const mid = pos.get(val);
    const node = new TreeNode(val);
    // Left first: in preorder the whole left subtree comes before the right one.
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }

  return build(0, inorder.length - 1);
}
