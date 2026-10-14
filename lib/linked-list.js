/**
 * Singly linked list helpers shared by problems and tests.
 *
 * You can import these in your solutions:
 *   import { ListNode } from '../../../lib/linked-list.js';
 */

/** A node of a singly linked list. */
export class ListNode {
  /**
   * @param {number} [val=0] - Value stored in the node.
   * @param {ListNode | null} [next=null] - Next node, or null at the tail.
   */
  constructor(val = 0, next = null) {
    /** @type {number} */
    this.val = val;
    /** @type {ListNode | null} */
    this.next = next;
  }
}

/**
 * Builds a linked list from an array of values.
 *
 * @param {number[]} values - Values in list order.
 * @returns {ListNode | null} Head of the new list (null for an empty array).
 */
export function arrayToList(values) {
  const dummy = new ListNode();
  let tail = dummy;
  for (const v of values) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

/**
 * Converts a linked list back into an array of values.
 * Throws if the list is longer than `limit` (protects tests from cycles).
 *
 * @param {ListNode | null} head - Head of the list.
 * @param {number} [limit=1_000_000] - Maximum number of nodes to walk.
 * @returns {number[]} Values in list order.
 */
export function listToArray(head, limit = 1_000_000) {
  const out = [];
  let node = head;
  while (node) {
    if (out.length >= limit) {
      throw new Error(`listToArray: more than ${limit} nodes — does the list contain a cycle?`);
    }
    out.push(node.val);
    node = node.next;
  }
  return out;
}

/**
 * Builds a list whose tail points back to the node at index `pos`
 * (pos = -1 means no cycle).
 *
 * @param {number[]} values - Values in list order.
 * @param {number} pos - Index of the node the tail links to, or -1.
 * @returns {{ head: ListNode | null, nodes: ListNode[] }} The head and all nodes by index.
 */
export function arrayToCyclicList(values, pos) {
  const nodes = values.map((v) => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
  if (pos >= 0 && nodes.length > 0) nodes[nodes.length - 1].next = nodes[pos];
  return { head: nodes[0] ?? null, nodes };
}

/** A node of a list with an extra `random` pointer (Copy List with Random Pointer). */
export class RandomListNode {
  /**
   * @param {number} val - Value stored in the node.
   * @param {RandomListNode | null} [next=null] - Next node.
   * @param {RandomListNode | null} [random=null] - Arbitrary node in the list, or null.
   */
  constructor(val, next = null, random = null) {
    /** @type {number} */
    this.val = val;
    /** @type {RandomListNode | null} */
    this.next = next;
    /** @type {RandomListNode | null} */
    this.random = random;
  }
}

/**
 * Builds a random-pointer list from `[val, randomIndex | null]` pairs.
 *
 * @param {Array<[number, number | null]>} pairs - Node descriptions in list order.
 * @returns {RandomListNode | null} Head of the new list.
 */
export function pairsToRandomList(pairs) {
  const nodes = pairs.map(([val]) => new RandomListNode(val));
  pairs.forEach(([, randomIndex], i) => {
    nodes[i].next = nodes[i + 1] ?? null;
    nodes[i].random = randomIndex === null ? null : nodes[randomIndex];
  });
  return nodes[0] ?? null;
}

/**
 * Converts a random-pointer list into `[val, randomIndex | null]` pairs.
 *
 * @param {RandomListNode | null} head - Head of the list.
 * @returns {Array<[number, number | null]>} Node descriptions in list order.
 */
export function randomListToPairs(head) {
  const nodes = [];
  for (let node = head; node; node = node.next) {
    if (nodes.length > 1_000_000) throw new Error('randomListToPairs: list too long — cycle?');
    nodes.push(node);
  }
  const index = new Map(nodes.map((n, i) => [n, i]));
  return nodes.map((n) => [n.val, n.random === null ? null : index.get(n.random) ?? -1]);
}
