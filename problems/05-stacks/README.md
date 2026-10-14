# Stacks

A **stack** is a collection where you add and remove items at the same end, the **top**. The last item pushed is the first one popped: **LIFO** (last in, first out). Think of a pile of plates, the browser's back button, or the call stack of your program.

## Stacks in JavaScript

There's no separate stack class. A plain array is the stack, and the **end of the array** is the top:

```js
const stack = [];
stack.push(3);                    // add to the top        → [3]
stack.push(7);                    //                       → [3, 7]
stack[stack.length - 1];          // peek at the top       → 7  (or stack.at(-1))
stack.pop();                      // remove the top        → returns 7, stack is [3]
stack.length === 0;               // is it empty?
```

**Always work at the end.** `push` and `pop` are O(1) (amortized). `shift` and `unshift` work at the *front* and are **O(n)**, because every other element has to move. A "stack" built with `unshift`/`shift` quietly turns an O(n) algorithm into O(n²).

Other JS gotchas:

- `[].pop()` returns `undefined` instead of throwing. Check `stack.length` before you pop or peek, or the bug will show up somewhere else.
- `stack.at(-1)` and `stack[stack.length - 1]` both peek. Don't use `stack[-1]`, which is just `undefined`.
- Store **indices** rather than values when you need distances or positions later (Daily Temperatures, Largest Rectangle). You can always read the value through the index.
- Strings are immutable. To build a result character by character, push onto an array and `join('')` at the end (or rely on `+=`, which V8 handles well). Avoid repeated `slice` calls in a loop.

## Operations and their cost

| Operation | Array method | Time |
| --- | --- | --- |
| Push onto the top | `push(x)` | O(1) amortized |
| Pop from the top | `pop()` | O(1) |
| Peek at the top | `stack[stack.length - 1]` / `at(-1)` | O(1) |
| Is empty / size | `length` | O(1) |
| Search for a value | `includes`, `indexOf` | O(n) — if you need this, a stack is probably the wrong tool |
| Add/remove at the *bottom* | `unshift` / `shift` | **O(n)** — avoid |

## When to reach for a stack

A stack fits whenever the **most recent unfinished thing** has to be dealt with first:

- **Matching and nesting**: brackets, HTML tags, nested `k[...]` encodings. An opener waits on the stack until its closer arrives (Valid Parentheses, Decode String).
- **Evaluating expressions**: operands wait on the stack until an operator consumes them (Evaluate Reverse Polish Notation).
- **Undo / backtracking / "resume where I left off"**: push the state before diving in, pop to go back. Recursion is this idea with the call stack doing the work. Any recursive algorithm can be rewritten with an explicit stack.
- **Collisions and cancellations**: a new item interacts with the most recent survivors, possibly wiping out several of them (Asteroid Collision).
- **"Previous / next greater (or smaller) element"**: the job of the *monotonic stack*, below.
- **Augmented stacks**: store extra info next to each element, such as "minimum so far", to answer queries in O(1) (Min Stack).

## Monotonic stacks

A **monotonic stack** is a regular stack with a rule: its contents stay sorted, always increasing or always decreasing from bottom to top. Before you push a new element, you pop everything that would break the order. **The moment an element is popped is the moment you learn its answer**: the element that popped it is its "next greater/smaller", and the element left beneath it is its "previous greater/smaller".

Example: find the **next greater element** for each number in `[2, 1, 5, 3, 4]`. Keep a stack of indices whose values *decrease* from bottom to top. These are the elements still waiting for something bigger.

```
i  value  action                                stack (values)   answers so far
0  2      push                                  [2]
1  1      1 < 2, push                           [2, 1]
2  5      5 > 1: pop 1 → next greater is 5
          5 > 2: pop 2 → next greater is 5
          push                                  [5]              2→5, 1→5
3  3      3 < 5, push                           [5, 3]
4  4      4 > 3: pop 3 → next greater is 4
          4 < 5, stop; push                     [5, 4]           3→4
end       5 and 4 never found anything bigger → -1
```

Result: `[5, 5, -1, 4, -1]`. There's a `while` loop inside a `for` loop, but each index is **pushed once and popped at most once**, so the total work is O(n). That's the amortized argument behind every monotonic-stack solution, and it's what turns O(n²) "scan forward from every element" solutions into O(n).

Choosing the direction:

| You want, for each element… | Keep the stack… | Pop while the top is… |
| --- | --- | --- |
| next **greater** | decreasing | `<` the new value |
| next **smaller** | increasing | `>` the new value |
| previous greater / smaller | same stacks: after popping, the element left on top is the answer for the new item | |

Decide on purpose whether equal values pop (`<=` vs `<`). That choice decides whether "greater" means strictly greater, and it's the most common source of off-by-one bugs in these problems.

## Patterns in this topic

- **Stack**: matching, nesting, expression evaluation, simulation of collisions.
- **Monotonic Stack**: next/previous greater or smaller, spans and widths (Daily Temperatures, Largest Rectangle), and greedy "keep the smallest sequence" problems (Remove K Digits).
- Supporting patterns: **Design** (Min Stack), **Simulation** (Asteroid Collision), **String Parsing** (Decode String), **Greedy** (Remove K Digits).

## Problem order

| # | Problem | Difficulty | Patterns |
| --- | --- | --- | --- |
| 01 | Valid Parentheses | Easy | Stack |
| 02 | Min Stack | Medium | Stack, Design |
| 03 | Evaluate Reverse Polish Notation | Medium | Stack |
| 04 | Asteroid Collision | Medium | Stack, Simulation |
| 05 | Decode String | Medium | Stack, String Parsing |
| 06 | Daily Temperatures | Medium | Monotonic Stack |
| 07 | Remove K Digits | Medium | Monotonic Stack, Greedy |
| 08 | Largest Rectangle in Histogram | Hard | Monotonic Stack |

Problems 01–05 build the basic habit of pushing what's unfinished and popping when it can be resolved. Problems 06–08 introduce the monotonic stack, and each one leans harder on the "answer is decided at pop time" idea. Largest Rectangle in Histogram combines both the previous and the next smaller element in a single pass.
