/*
 * Title:      LRU Cache
 * Difficulty: Medium
 * Patterns:   Design, Hash Map, Doubly Linked List
 *
 * Solution — LRU Cache
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Each operation needs two things in O(1):
 *   • find the entry for a key → a hash map;
 *   • keep entries ordered by recency, with "move this entry to the most-
 *     recent end" and "drop the least-recent entry" both cheap.
 * An array can't do the second part: finding an entry is O(n) (indexOf) and
 * removing it from the middle shifts everything after it (splice), also
 * O(n). A doubly linked list can: if you already hold a node, you can unlink
 * it from anywhere in O(1) (it knows both neighbours) and append it at the
 * end in O(1).
 *
 * So we combine them: the map goes from key → list node, and the list is
 * ordered from least recently used (front) to most recently used (back).
 * The map gives us the node, and the list moves it.
 *
 * Two sentinel nodes, `head` and `tail`, are always in the list. Real
 * entries live between them, so insert/remove never meet a null neighbour
 * and an empty cache needs no special case. This is the same idea as the
 * dummy-node trick in singly linked lists.
 *
 * Approach
 * ────────
 *   Node = { key, value, prev, next }   (key is needed to delete from the
 *                                        map when the node is evicted)
 *   remove(node):    node.prev.next = node.next; node.next.prev = node.prev
 *   addToBack(node): link node between tail.prev and tail
 *
 *   get(key):
 *     node = map.get(key); if none → -1
 *     remove(node); addToBack(node); return node.value
 *
 *   put(key, value):
 *     if key exists: update node.value; remove + addToBack; done
 *     if map.size === capacity:
 *        lru = head.next; remove(lru); map.delete(lru.key)
 *     node = new Node(key, value); addToBack(node); map.set(key, node)
 *
 * Walkthrough — capacity 2
 * ───────────
 *   put(1,1)   list: H ⇄ [1] ⇄ T
 *   put(2,2)   list: H ⇄ [1] ⇄ [2] ⇄ T
 *   get(1)→1   move 1 to the back:     H ⇄ [2] ⇄ [1] ⇄ T
 *   put(3,3)   full → evict head.next = [2]
 *              list: H ⇄ [1] ⇄ [3] ⇄ T
 *   get(2)→-1  not in the map
 *   put(4,4)   full → evict [1]        H ⇄ [3] ⇄ [4] ⇄ T
 *   get(1)→-1, get(3)→3 (moves 3 back), get(4)→4
 *
 * Complexity
 * ──────────
 *   Time:  O(1) average for get and put. Each one is a constant number of
 *          Map operations and pointer updates.
 *   Space: O(capacity) — one map entry and one list node per cached key.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • JavaScript shortcut: a `Map` iterates its keys in INSERTION order, so
 *     a Map alone can act as the recency list:
 *         get(key):   if (!m.has(key)) return -1;
 *                     const v = m.get(key); m.delete(key); m.set(key, v); return v;
 *         put(k, v):  m.delete(k); m.set(k, v);
 *                     if (m.size > cap) m.delete(m.keys().next().value); // oldest
 *     Deleting and re-inserting moves a key to the "newest" end, and the
 *     first key from the iterator is the least recently used. It's short,
 *     fast and fine in production JS. One V8 detail: deleted entries stay
 *     in the table as tombstones until it is compacted, and
 *     `m.keys().next()` has to skip them. Under constant eviction this
 *     makes it noticeably slower than the linked list, though it still
 *     passes the performance test here. Internally the engine
 *     keeps an ordered hash table, which is the same "hash map + linked
 *     order" idea. Interviews usually ask for the explicit version
 *     below, because it carries over to any language. (Java's
 *     LinkedHashMap and Python's OrderedDict are the same idea.)
 *   • Array (or array of keys) for recency: indexOf + splice per operation
 *     is O(capacity). With 50,000 entries and 250,000 operations that's
 *     billions of element comparisons and moves.
 *   • Timestamps + scanning for the oldest on eviction: O(1) get, but O(n)
 *     put whenever the cache is full.
 *   • A SINGLY linked list can't unlink a node in O(1) unless you also find
 *     its predecessor, which takes a walk. That's why the list is doubly
 *     linked.
 *   • Forgetting to delete the evicted key from the map (the map keeps
 *     growing and get returns stale values), or forgetting that put on an
 *     existing key must also refresh its recency.
 *   • `if (!value)`-style checks treat the legal value 0 as "missing".
 */

/** A node of the recency list. */
class DLLNode {
  /**
   * @param {number} key
   * @param {number} value
   */
  constructor(key, value) {
    this.key = key;
    this.value = value;
    /** @type {DLLNode | null} */
    this.prev = null;
    /** @type {DLLNode | null} */
    this.next = null;
  }
}

export class LRUCache {
  /** @param {number} capacity */
  constructor(capacity) {
    this.capacity = capacity;
    /** @type {Map<number, DLLNode>} key → node in the recency list */
    this.map = new Map();
    // Sentinels: head.next is the least recently used entry, tail.prev the most recent.
    this.head = new DLLNode(-1, -1);
    this.tail = new DLLNode(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Unlinks a node from the list in O(1).
   *
   * @param {DLLNode} node
   */
  #remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  /**
   * Appends a node just before the tail sentinel (most recently used position).
   *
   * @param {DLLNode} node
   */
  #addToBack(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  /**
   * @param {number} key
   * @returns {number}
   */
  get(key) {
    const node = this.map.get(key);
    if (node === undefined) return -1; // compare with undefined: value 0 is legal
    this.#remove(node); // mark as most recently used
    this.#addToBack(node);
    return node.value;
  }

  /**
   * @param {number} key
   * @param {number} value
   * @returns {void}
   */
  put(key, value) {
    const existing = this.map.get(key);
    if (existing !== undefined) {
      existing.value = value; // update in place, size unchanged
      this.#remove(existing);
      this.#addToBack(existing);
      return;
    }

    if (this.map.size === this.capacity) {
      const lru = this.head.next; // least recently used real entry
      this.#remove(lru);
      this.map.delete(lru.key); // this is why nodes remember their key
    }

    const node = new DLLNode(key, value);
    this.#addToBack(node);
    this.map.set(key, node);
  }
}
