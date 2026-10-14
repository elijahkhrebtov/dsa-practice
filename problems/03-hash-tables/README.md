# Hash Tables

A **hash table** stores key → value pairs (or just keys, for a set) and finds any key in **O(1) time on average**, no matter how many entries it holds. It's the single most useful tool for turning an O(n²) "search for a partner" loop into an O(n) single pass.

## How it works

1. **Hashing.** A hash function turns a key into an integer, and `hash % capacity` picks a **bucket** (a slot in an underlying array). A good hash spreads similar keys (`"ab"` and `"ba"`, or `1000` and `2000`) across different buckets.
2. **Collisions.** Different keys can land in the same bucket. The two classic fixes:
   - **Separate chaining**: every bucket holds a small list of entries, and lookups scan only that list.
   - **Open addressing**: on a collision, probe the next slot (linear probing, quadratic probing, double hashing) until you find the key or an empty slot.
3. **Load factor** = `size / capacity`. As it grows, chains get longer (or probe sequences get longer). Real implementations **resize** once it passes a threshold (often 0.75): allocate an array about twice as big and re-insert every entry, because each entry's bucket depends on the capacity. One resize costs O(n), but doubling makes it rare enough that inserts stay **O(1) amortized**.

### Average vs worst case

Everything is O(1) **on average**, assuming the hash spreads keys evenly. In the worst case (every key lands in the same bucket, through bad luck, a bad hash or an adversary) a lookup degrades to **O(n)**. In interviews, "hash map lookup is O(1)" means the average case, and that's the standard assumption.

## Hash tables in JavaScript

| | `Map` | `Set` | Plain object `{}` |
| --- | --- | --- | --- |
| Stores | key → value | unique values | string/symbol key → value |
| Key types | **any**, compared with SameValueZero (`1` and `"1"` are different keys, `NaN` equals `NaN`, objects by reference) | any, same comparison as `Map` | keys are **coerced to strings**: `obj[1]` and `obj["1"]` are the same key |
| Size | `map.size`, O(1) | `set.size`, O(1) | `Object.keys(obj).length`, O(n) |
| Iteration order | insertion order | insertion order | integer-like keys first (ascending), then the rest in insertion order |
| Inherited keys | none | none | `"constructor"`, `"toString"`, … live on the prototype. Use `Object.create(null)` or `Object.hasOwn` |

**Prefer `Map` and `Set`** in these problems. They're built for frequent inserts and deletes, keep numbers as numbers, and have no prototype surprises.

### Gotchas

- **`has` vs truthiness.** `if (map.get(x))` is wrong whenever the stored value can be `0`, `""` or `false`. An index of 0 or a count of 0 looks the same as "missing". Use `map.has(x)`, or compare with `undefined`.
- **Counting idiom:** `map.set(x, (map.get(x) ?? 0) + 1)`. Use `??` rather than `||`, because it's explicit about only defaulting `undefined`.
- **Arrays and objects as keys compare by reference.** `map.set([1, 2], 'a'); map.get([1, 2])` is `undefined`, since the second `[1, 2]` is a different array. To use a pair, tuple or list as a key, build a **composite string key**: `` `${row},${col}` `` or `arr.join(',')`. Pick a separator that can't appear inside the parts (`[1, 23]` and `[12, 3]` both become `"123"` without one).
- **Object key coercion.** `obj[-0]`, `obj[0]` and `obj["0"]` are all the same key. `obj[{}]` is the key `"[object Object]"`.
- **Iterating while mutating.** Deleting the current entry inside `for…of` over a `Map` is safe. Adding new keys during iteration means the loop will visit them too.
- **Counting characters:** for lowercase-only input, a fixed `new Array(26).fill(0)` indexed by `code - 97` is a hash table with a perfect hash, and it's usually faster than a `Map`.

## Operations

| Operation | Average | Worst | Notes |
| --- | --- | --- | --- |
| `map.get(k)` / `map.has(k)` / `set.has(v)` | O(1) | O(n) | the reason to use a hash table |
| `map.set(k, v)` / `set.add(v)` | O(1) amortized | O(n) | occasional resize |
| `map.delete(k)` / `set.delete(v)` | O(1) | O(n) | |
| `map.size` | O(1) | O(1) | |
| iterate all entries | O(n) | O(n) | insertion order |
| build from an array: `new Set(arr)` | O(n) | O(n²) | |
| find a min/max key, or "next larger key" | O(n) | O(n) | hash tables are **unordered**: reach for sorting, a heap or a BST |

Space is O(n) for n entries.

## Patterns in this topic

- **Hash Map (lookup of a complement/partner):** "have I already seen the value that completes this one?" (Two Sum).
- **Frequency Counting:** count occurrences, then compare or rank the counts (Valid Anagram, Top K Frequent).
- **Canonical keys / grouping:** map every item to a normalized key so equivalent items collide on purpose (Group Anagrams).
- **Hash Set membership:** O(1) "is x present?" to avoid sorting (Longest Consecutive Sequence).
- **Prefix Sum + Hash Map:** count earlier prefix sums to answer "how many subarrays sum to k?" in one pass (Subarray Sum Equals K).
- **Design:** build the hash table yourself (Design HashMap), or combine a map with an array to support extra operations in O(1) (Insert Delete GetRandom O(1)).
- **Bucket Sort / Top-K:** frequencies are bounded by n, so they can be used directly as array indices.

## Problem order

1. **01-two-sum** (Easy): the classic complement lookup.
2. **02-valid-anagram** (Easy): frequency counting.
3. **03-design-hashmap** (Medium): build a hash table with chaining and resizing.
4. **04-group-anagrams** (Medium): canonical keys for grouping.
5. **05-top-k-frequent-elements** (Medium): counting plus bucket sort.
6. **06-longest-consecutive-sequence** (Medium): hash set and "start of a run" detection.
7. **07-subarray-sum-equals-k** (Medium): prefix sums with a hash map.
8. **08-insert-delete-getrandom-o1** (Medium): map + array design.
