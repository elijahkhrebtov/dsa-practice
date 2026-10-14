# Strings

A **string** is a sequence of characters. Most string problems are really array problems in disguise (indices, windows, two pointers), with a few extra twists: a small, fixed alphabet that makes counting cheap, and immutability, which makes "editing" a string expensive.

## Strings in JavaScript

- **Immutable.** `s[0] = 'x'` silently does nothing. Every "change" (`toUpperCase`, `replace`, `slice`, `+`) builds a **new** string. To edit characters in place, convert to an array first: `const a = [...s]` (or `s.split('')`), mutate, then `a.join('')`.
- **Indexing is O(1):** `s[i]`, `s.charAt(i)` and `s.charCodeAt(i)` don't copy anything. `s.length` is O(1).
- **`charCodeAt` beats comparing one-character strings** in hot loops and turns a character into an array index: `s.charCodeAt(i) - 97` maps `'a'..'z'` to `0..25`. `String.fromCharCode(97 + k)` goes back.
- **UTF-16.** JS strings are sequences of 16-bit code units. Characters outside the Basic Multilingual Plane (most emoji, e.g. `'😀'`) take **two** units, so `'😀'.length === 2` and `s[i]` can return half a character. `[...s]` and `for (const ch of s)` iterate by code point instead. The problems here use ASCII only, so `s[i]` / `charCodeAt` are safe, but remember this in real code.
- **Comparison.** `===` compares contents (strings are values, not references). `<` / `>` compare UTF-16 code units lexicographically, so `'Z' < 'a'` and `'10' < '9'`.
- **Case folding.** For ASCII, `'A'..'Z'` are codes 65–90 and `'a'..'z'` are 97–122. They differ by exactly 32, so `code | 32` lowercases an ASCII letter without allocating.

### Building strings: concatenation vs `join`

`result += piece` in a loop *looks* quadratic, because each `+=` creates a new string. Modern engines (V8 included) optimize it with "ropes" (lazy concatenation trees), so appending is usually cheap in practice. But:

- the rope gets flattened (O(n)) the first time you index into it, so **mixing `+=` with `s[i]` reads in a loop can go quadratic**;
- other languages (Java, Python, C#) give no such guarantee, and interviewers expect you to know the classic answer.

The portable habit: **push pieces into an array and `join('')` once at the end**, especially when you also need to pop characters (backtracking builds a path array, then joins it at the leaves).

### Slicing costs O(k)

`s.slice(i, j)`, `s.substring(i, j)`, `s.split('')`, `[...s]`, `s.split('').reverse().join('')` all cost time proportional to the length they produce. A loop that slices on every iteration is a hidden O(n) inside your O(n). The fix is almost always to **work with indices** (`left`, `right`, `start`, `length`) and slice **once**, at the very end.

### Counting characters

| Alphabet | Structure | Notes |
| --- | --- | --- |
| lowercase (or uppercase) letters | `new Int32Array(26)` / `new Array(26).fill(0)`, index `code - 97` | fastest; comparing two count arrays is O(26) = O(1) |
| ASCII | `new Int32Array(128)`, index `code` | same idea, covers digits, spaces, symbols |
| anything (Unicode, words) | `Map` | `map.set(c, (map.get(c) ?? 0) + 1)`; use `has`, not truthiness |

A fixed-size frequency array counts as **O(1) space**: it doesn't grow with the input.

## Operations

| Operation | Time | Notes |
| --- | --- | --- |
| `s[i]`, `s.charCodeAt(i)`, `s.length` | O(1) | |
| `a === b` | O(n) | compares character by character (fast path if lengths differ) |
| `s.slice(i, j)` / `substring` | O(j − i) | creates a new string |
| `s + t` | O(1)–O(n + m) | engine-dependent (ropes), O(n + m) once flattened |
| `s.indexOf(t)` / `s.includes(t)` | O(n · m) worst | don't call it inside a loop over `s` |
| `s.split('')`, `[...s]`, `arr.join('')` | O(n) | |
| `s.toLowerCase()`, `s.replace(/re/g, …)` | O(n) | allocates a new string |
| sort the characters | O(n log n) | `[...s].sort().join('')`; counting is O(n) for a fixed alphabet |

## Patterns in this topic

- **Two Pointers:** walk inward from both ends to check symmetry without copying (Valid Palindrome).
- **Sliding Window + Hash Map / Frequency Counting:** keep a window of the string plus counts of what's inside it; grow on the right, shrink on the left when the window breaks a rule. Every index enters and leaves once → O(n) (Longest Substring Without Repeating Characters, Longest Repeating Character Replacement, Permutation in String, Minimum Window Substring).
- **Expand Around Center:** every palindrome grows symmetrically from one of 2n − 1 centers (Longest Palindromic Substring).
- **Backtracking:** build an answer character by character, recurse, undo; prune prefixes that can't succeed (Letter Combinations of a Phone Number, Generate Parentheses).
- **Dynamic Programming on prefixes:** "can / in how many ways can the first i characters be …?" gives a 1-D table (Word Break, Decode Ways).
- **Dynamic Programming on two strings:** `dp[i][j]` describes the first i characters of one string against the first j of the other; each cell depends on its left, upper and upper-left neighbours (Longest Common Subsequence, Edit Distance, Regular Expression Matching). Often reducible to O(min(n, m)) memory by keeping one or two rows.

## Problem order

1. **01-valid-palindrome** (Easy): two pointers, skipping characters that don't count.
2. **02-longest-substring-without-repeating-characters** (Medium): the canonical variable-size sliding window.
3. **03-longest-repeating-character-replacement** (Medium): sliding window with a "length − most frequent" validity rule.
4. **04-permutation-in-string** (Medium): fixed-size sliding window comparing letter counts.
5. **05-longest-palindromic-substring** (Medium): expand around center (or interval DP).
6. **06-letter-combinations-of-a-phone-number** (Medium): backtracking over independent choices.
7. **07-generate-parentheses** (Medium): backtracking with pruning.
8. **08-word-break** (Medium): DP over prefixes with a dictionary lookup.
9. **09-decode-ways** (Medium): DP over prefixes, counting ways.
10. **10-longest-common-subsequence** (Medium): the classic two-string DP table.
11. **11-edit-distance** (Medium): two-string DP with three operations.
12. **12-minimum-window-substring** (Hard): sliding window with a "how many requirements are still missing" counter.
13. **13-regular-expression-matching** (Hard): two-string DP (or memoized recursion) with `.` and `*`.
