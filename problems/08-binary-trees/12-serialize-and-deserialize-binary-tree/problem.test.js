import { describe, it, expect, vi } from 'vitest';
import { serialize, deserialize } from './problem.js';
import { TreeNode, arrayToTree, treeToArray, treeHeight } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Serializes the tree written as `values`, decodes it, and returns the result in level-order form. */
function roundTrip(values) {
  const data = serialize(arrayToTree(values));
  expect(typeof data, 'serialize must return a string').toBe('string');
  return treeToArray(deserialize(data));
}

/** All node objects of a tree (BFS). */
function allNodes(root) {
  const out = root ? [root] : [];
  for (let i = 0; i < out.length; i++) {
    if (out[i].left) out.push(out[i].left);
    if (out[i].right) out.push(out[i].right);
  }
  return out;
}

/**
 * Random tree with `n` nodes and values from `nextVal()`. Each new node is
 * hung on a random free child slot; with probability `skew` it goes under the
 * most recently added node instead, which produces long chains.
 */
function randomTree(rng, n, nextVal, skew = 0) {
  if (n === 0) return null;
  const root = new TreeNode(nextVal());
  const slots = [[root, 'left'], [root, 'right']];
  for (let i = 1; i < n; i++) {
    const k = rng() < skew ? slots.length - 1 - randomInt(rng, 0, 1) : randomInt(rng, 0, slots.length - 1);
    const [parent, side] = slots[k];
    slots[k] = slots[slots.length - 1];
    slots.pop();
    const node = new TreeNode(nextVal());
    parent[side] = node;
    slots.push([node, 'left'], [node, 'right']);
  }
  return root;
}

/** A chain of `n` nodes where `side(i)` says on which side node i+1 hangs under node i. */
function chain(n, side, valueOf = (i) => (i % 2001) - 1000) {
  const root = new TreeNode(valueOf(0));
  let cur = root;
  for (let i = 1; i < n; i++) {
    cur[side(i - 1)] = new TreeNode(valueOf(i));
    cur = cur[side(i - 1)];
  }
  return root;
}

const MAX_CHARS_PER_NODE = 50;

describe('Serialize and Deserialize Binary Tree', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 3, null, null, 4, 5] survives a round trip', () => {
      expect(roundTrip([1, 2, 3, null, null, 4, 5])).toEqual([1, 2, 3, null, null, 4, 5]);
    });

    it('empty tree: serialize(null) is a string and deserializes back to null', () => {
      const data = serialize(null);
      expect(typeof data, 'serialize must return a string, even for an empty tree').toBe('string');
      expect(deserialize(data)).toBeNull();
    });

    it('[-12, 3, null, 45]: multi-digit negatives and a left-only chain', () => {
      expect(roundTrip([-12, 3, null, 45])).toEqual([-12, 3, null, 45]);
    });
  });

  describe('basics', () => {
    it('a single node', () => {
      expect(roundTrip([7])).toEqual([7]);
    });

    it('a single node with value 0 (0 is a value, not "missing")', () => {
      expect(roundTrip([0])).toEqual([0]);
    });

    it('a perfect tree of 15 nodes', () => {
      const values = Array.from({ length: 15 }, (_, i) => i + 1);
      expect(roundTrip(values)).toEqual(values);
    });

    it('deserialize returns real TreeNode objects', () => {
      const root = deserialize(serialize(arrayToTree([1, 2, 3])));
      expect(root).toBeInstanceOf(TreeNode);
      expect(root.left).toBeInstanceOf(TreeNode);
      expect(root.right).toBeInstanceOf(TreeNode);
    });

    it('does not modify the tree passed to serialize', () => {
      const values = [5, 3, 8, null, 4, 7];
      const root = arrayToTree(values);
      serialize(root);
      expect(treeToArray(root)).toEqual(values);
    });
  });

  describe('values', () => {
    it('negative, zero and multi-digit values: [-1000, 999, -1, 0, 10, -10, 1000]', () => {
      const values = [-1000, 999, -1, 0, 10, -10, 1000];
      expect(roundTrip(values)).toEqual(values);
    });

    it('repeated values: [5, 5, 5, 5, null, 5]', () => {
      expect(roundTrip([5, 5, 5, 5, null, 5])).toEqual([5, 5, 5, 5, null, 5]);
    });

    it('[1, 12] and [11, 2] get different strings (digits need a separator)', () => {
      expect(serialize(arrayToTree([1, 12]))).not.toBe(serialize(arrayToTree([11, 2])));
      expect(roundTrip([1, 12])).toEqual([1, 12]);
      expect(roundTrip([11, 2])).toEqual([11, 2]);
    });

    it('signs and sides are preserved: [1, -2], [1, null, 2] and [-1, 2]', () => {
      expect(roundTrip([1, -2])).toEqual([1, -2]);
      expect(roundTrip([1, null, 2])).toEqual([1, null, 2]);
      expect(roundTrip([-1, 2])).toEqual([-1, 2]);
    });
  });

  describe('shape', () => {
    it('[1, 2] and [1, null, 2] are different trees and must get different strings', () => {
      expect(serialize(arrayToTree([1, 2]))).not.toBe(serialize(arrayToTree([1, null, 2])));
    });

    it('left-skewed chain of 3,000 nodes (deep trees must work, and the string stays linear)', () => {
      const root = chain(3000, () => 'left');
      const data = serialize(root);
      expect(data.length, 'serialized string is too long for a chain').toBeLessThanOrEqual(MAX_CHARS_PER_NODE * 3000);
      const copy = deserialize(data);
      expect(treeHeight(copy)).toBe(3000);
      expect(treeToArray(copy)).toEqual(treeToArray(root));
    });

    it('right-skewed chain of 3,000 nodes', () => {
      const root = chain(3000, () => 'right');
      expect(treeToArray(deserialize(serialize(root)))).toEqual(treeToArray(root));
    });

    it('zig-zag chain of 2,000 nodes (left, right, left, …)', () => {
      const root = chain(2000, (i) => (i % 2 === 0 ? 'left' : 'right'));
      expect(treeToArray(deserialize(serialize(root)))).toEqual(treeToArray(root));
    });
  });

  describe('no hidden state — the string is the whole story', () => {
    it('deserialize builds brand-new nodes, never the original ones', () => {
      const root = arrayToTree([1, 2, 3, 4, 5, 6, 7]);
      const original = new Set(allNodes(root));
      const copy = deserialize(serialize(root));
      expect(treeToArray(copy)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      for (const node of allNodes(copy)) {
        expect(original.has(node), `node ${node.val} is an original node, not a new one`).toBe(false);
      }
    });

    it('changing the original tree after serializing does not affect what deserialize builds', () => {
      const root = arrayToTree([1, 2, 3]);
      const data = serialize(root);
      root.val = 100;
      root.left.left = new TreeNode(9);
      root.right = null;
      expect(treeToArray(deserialize(data))).toEqual([1, 2, 3]);
    });

    it('decoding the same string twice gives two independent trees', () => {
      const data = serialize(arrayToTree([1, 2, 3]));
      const a = deserialize(data);
      const b = deserialize(data);
      expect(a === b, 'the two results should be different objects').toBe(false);
      a.left.val = 42;
      expect(treeToArray(b)).toEqual([1, 2, 3]);
    });

    it('interleaved calls: serialize A, serialize B, then decode B, A, and A again', () => {
      const sa = serialize(arrayToTree([1, 2, null, 3]));
      const sb = serialize(arrayToTree([-4, null, -5, -6]));
      expect(treeToArray(deserialize(sb))).toEqual([-4, null, -5, -6]);
      expect(treeToArray(deserialize(sa))).toEqual([1, 2, null, 3]);
      expect(treeToArray(deserialize(sa))).toEqual([1, 2, null, 3]);
    });

    it('a freshly loaded copy of the module can decode the string (nothing stored in module variables)', async () => {
      const values = [3, 9, 20, null, null, 15, 7];
      const data = serialize(arrayToTree(values));
      vi.resetModules();
      const fresh = await import('./problem.js');
      expect(fresh.deserialize === deserialize, 'expected a fresh module instance').toBe(false);
      expect(treeToArray(fresh.deserialize(data))).toEqual(values);
    });
  });

  describe('randomized (seeded)', () => {
    it('300 random trees (some deep and skewed) survive a round trip', () => {
      const rng = createRng(9001);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 0, 120);
        const root = randomTree(rng, n, () => randomInt(rng, -1000, 1000), t % 3 === 0 ? 0.85 : 0);
        const expected = treeToArray(root);
        const data = serialize(root);
        expect(typeof data).toBe('string');
        expect(treeToArray(deserialize(data)), `tree ${JSON.stringify(expected)}`).toEqual(expected);
      }
    });
  });

  describe('performance', () => {
    it('round-trips a random 100,000-node tree in well under a second, with a linear-size string', () => {
      const rng = createRng(77);
      const n = 100_000;
      const root = randomTree(rng, n, () => randomInt(rng, -1000, 1000));
      const expected = treeToArray(root);
      const { result, ms } = measure(() => {
        const data = serialize(root);
        return { data, copy: deserialize(data) };
      });
      expect(typeof result.data).toBe('string');
      expect(result.data.length, 'serialized string is too long').toBeLessThanOrEqual(MAX_CHARS_PER_NODE * n);
      expect(treeToArray(result.copy)).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n) in both directions`).toBeLessThan(1000);
    });
  });
});
