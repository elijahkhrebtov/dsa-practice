# AGENTS.md

Guide for AI agents (and humans) working in this repository. `CLAUDE.md` is a symlink to this file.

## What this project is

A local, plain-JavaScript **DSA (data structures & algorithms) practice collection**. There is no app, no build and nothing to deploy. The user opens a problem in VS Code, writes the function body, and runs that problem's unit tests from the terminal. Progress is tracked automatically in `INDEX.md`.

- Plain JS, ES modules (`"type": "module"`), Node ≥ 20. No TypeScript, no bundler.
- Tests use **Vitest**.
- Problems are **grouped by data type** (one folder per data type). Each problem is tagged with the **solution patterns** it uses (binary search, sliding window, DP, …). `INDEX.md` lists problems both by data type and by pattern.
- Mostly Medium problems, plus some Easy warm-ups and a few Hard ones.

## Your role when the user is practicing

The user is here to **learn by solving problems themselves**. Unless they explicitly ask for the answer:

- Don't write or fix the body of their `problem.js` functions.
- When they're stuck, nudge them: point to the next unread `hint-N.md`, ask a guiding question, or explain a concept. Escalate gradually.
- When they ask for a review, comment on correctness, complexity, edge cases and style. Don't just paste `solution.js`.
- Never edit `problem.test.js` to make their code pass.

## Repository layout

```
.
├── AGENTS.md / CLAUDE.md        this guide (CLAUDE.md → AGENTS.md symlink)
├── README.md                    short how-to for humans
├── INDEX.md                     GENERATED table of contents + progress (don't hand-edit)
├── progress.json                GENERATED status per problem slug (attempted / completed)
├── package.json                 npm scripts (see Commands)
├── vitest.config.js             test config + the "run against solution.js" redirect
├── jsconfig.json                editor IntelliSense for JSDoc types
├── .vscode/tasks.json           "DSA: solve current problem" tasks
├── lib/                         shared helpers, importable from problems and tests
│   ├── linked-list.js           ListNode, arrayToList, listToArray, arrayToCyclicList, RandomListNode…
│   ├── tree.js                  TreeNode, arrayToTree, treeToArray (LeetCode level-order arrays), findNode…
│   ├── graph.js                 GraphNode, adjacencyToGraph, graphToAdjacency (Clone Graph)
│   ├── priority-queue.js        PriorityQueue (binary heap with comparator)
│   └── test-utils.js            seeded RNG, measure(), canonical(), withoutBuiltinSort()… (tests only)
├── scripts/
│   ├── solve.js                 runs one problem's tests (npm run solve / watch / solution / verify)
│   ├── progress-reporter.js     Vitest reporter: updates progress.json + INDEX.md after each run
│   ├── build-index.js           npm run index
│   ├── check.js                 npm run check — structural lint of all problems
│   └── lib/
│       ├── problems.js          problem discovery, header parsing, progress storage
│       ├── index-md.js          INDEX.md renderer
│       └── patterns.js          canonical list of pattern names
└── problems/
    └── NN-<data-type>/          e.g. 01-arrays, 08-binary-trees
        ├── README.md            primer on the data type ("# Title" is used as the topic name)
        └── NN-<slug>/           e.g. 03-maximum-subarray
            ├── problem.js       description + empty function the user implements
            ├── problem.test.js  exhaustive Vitest suite (imports ./problem.js)
            ├── hint-1.md        1–3 progressive hints, one per file
            ├── hint-2.md
            ├── hint-3.md
            └── solution.js      reference solution with a detailed explanation
```

Topics, in order: `01-arrays`, `02-strings`, `03-hash-tables`, `04-linked-lists`, `05-stacks`, `06-queues`, `07-heaps`, `08-binary-trees`, `09-binary-search-trees`, `10-tries`, `11-graphs`, `12-matrices`, `13-intervals`, `14-numbers-and-bits`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run solve <problem>` | Run one problem's tests against the user's `problem.js`. **Updates `progress.json` and `INDEX.md`**: all pass → ✅ completed, any failure → 🟨 attempted. |
| `npm run watch <problem>` | Same, re-running on every save (status updated each run). |
| `npm run solution <problem>` | Run the tests against the reference `solution.js`. Never touches progress. |
| `npm run solve` | Print progress and suggest the next problem. |
| `npm run index` | Rebuild `INDEX.md` from the folders + `progress.json`. |
| `npm test` | Run every test file against the user's code (no progress tracking). |
| `npm run verify` | Run every test file against the reference solutions. Must be fully green. |
| `npm run check` | Lint the structure/conventions of every problem. Must pass. |

`<problem>` can be the slug (`two-sum`), `topic/slug` (`hash-tables/two-sum`), a path to the problem folder or any file in it, or a unique part of the name (`npm run solve rain` → Trapping Rain Water).

How the solution redirect works: when `DSA_SOLUTION=1`, a tiny Vite plugin in `vitest.config.js` resolves `./problem.js` imports *from test files* to the sibling `solution.js`. That's why tests must import exactly `'./problem.js'`, and why `solution.js` must export the same names as `problem.js`.

How tracking works: `scripts/solve.js` sets `DSA_TRACK=1`, which adds `scripts/progress-reporter.js` to Vitest's reporters. After every run it maps each test file to its problem slug, calls `recordRun`, and regenerates `INDEX.md`. Status always reflects the latest run, so a completed problem goes back to attempted if a later run fails. Running Vitest any other way (`npm test`, the VS Code Vitest extension) doesn't change progress.

When you test things as an agent, use `npm run solution <slug>` or `npx vitest run <path>`. `npm run solve` writes to the user's `progress.json`.

## Authoring conventions

Copy the two reference problems exactly:
- `problems/03-hash-tables/01-two-sum/`: a function problem.
- `problems/05-stacks/02-min-stack/`: a class/design problem.

### Folder & naming
- Folder `problems/NN-topic/NN-slug/`. `NN` gives the order within the topic: fundamentals and Easy first, then Medium (grouped by pattern), then Hard.
- The slug is kebab-case and **globally unique**. It's what the user types in `npm run solve <slug>`.

### `problem.js`
1. **Header comment** (`/* … */`, not JSDoc). The first three lines are machine-read by the index builder:
   ```
    * Title:      Two Sum
    * Difficulty: Easy            ← Easy | Medium | Hard
    * Patterns:   Hash Map, Sorting   ← comma-separated names from scripts/lib/patterns.js
   ```
   After that come sections separated by `─── Name ───` rules: **Problem** (a full, unambiguous statement with input/output format; say whether the order of results matters, whether to modify in place, and what to return in degenerate cases), **Examples** (2–4, with a "Why" line where helpful), **Constraints**, and **Goal** (the target time/space complexity, especially when the tests enforce it with a performance test). Add an optional follow-up there too.
2. The two **run-command lines**, verbatim format, directly above the JSDoc:
   ```js
   // ▶ Run tests:   npm run solve <slug>
   // ⟳ Watch mode:  npm run watch <slug>
   ```
3. **JSDoc** on the exported function (or on the class and *every* method). Include a one-line summary, then `@param {type} name - meaning` for each parameter and `@returns {type} meaning`.
4. An **exported, empty implementation** whose body is just `// Your code here`. Class constructors also get `// Your code here`. If the problem needs `ListNode`/`TreeNode`/etc., import it at the top from `../../../lib/…` (the user may need to construct nodes).

### `problem.test.js`
- `import { describe, it, expect } from 'vitest';` then `import { fn } from './problem.js';`. Never import `solution.js`.
- Top-level `describe('<Title>')`, then nested `describe` groups such as `examples from the problem`, `edge cases`, `tricky cases`, `randomized (seeded)`, `performance`.
- **Test names should teach.** State the input and expected output when it's short, and add a nudge about what makes the case interesting, e.g. `'[3, 3], target 6 → [0, 1] (equal values at different indices are fine)'` or `'all negative numbers: the answer is the single largest element'`.
- Be exhaustive: cover the examples, minimum sizes (empty, single element), duplicates, negatives, zeros, extremes of the constraints, already-sorted or reverse-sorted input, and the classic off-by-one traps.
- **Randomized tests** compare against a tiny brute-force oracle written inside the test file. Only do this when the brute force is obviously simpler than the intended solution. Always seed the RNG with `createRng(seed)` from `lib/test-utils.js`, never `Math.random`.
- **Multiple valid answers**: validate properties, or normalize with `canonical()` before comparing. Never assume one particular order unless the problem statement requires it.
- **In-place problems**: assert on the mutated input.
- **Performance tests**, when the target complexity matters: build a large deterministic input, time it with `measure()`, and assert with a generous limit (≈ 500–1500 ms). The intended solution should take a few ms. A naive solution should clearly exceed the limit but still *finish* (aim for seconds, not minutes), because synchronous code can't be interrupted by test timeouts. Put the reason in the test name: `'(an O(n²) pair search will be far too slow)'`.
- `toEqual` treats `-0` and `0` as different. Use `normalizeZeros()` where a correct solution might produce `-0`.
- Floating-point results: use `toBeCloseTo`.
- The stub (returns `undefined`) must fail the suite, and the reference solution must pass every test.

### Hints (`hint-1.md` … `hint-3.md`)
- 1–3 files, each starting with `# Hint N`. Easy problems get 1–2, Medium 2–3, Hard 3.
- Make them progressive: hint 1 is an observation or question, hint 2 names the technique or data structure, hint 3 is nearly the algorithm (still no code).

### `solution.js`
- The header comment repeats the same `Title:` / `Difficulty:` / `Patterns:` lines as `problem.js` (the index builder falls back to them if the user mangles their `problem.js` header), then has a `Solution — <Title>` heading and these sections: **Intuition**, **Approach** (numbered steps), **Walkthrough** (trace an example), **Complexity** (time and space, with the reason), and **Alternatives & pitfalls** (brute force, other valid approaches, common bugs).
- Then the working implementation with helpful inline comments. It must export the **same names** as `problem.js`.

### Topic `README.md`
A primer on the data type: what it is, how it's represented in JS, the operations and their Big-O (a table), JS-specific gotchas (e.g. `shift()` is O(n)), the patterns that show up in the topic, and the problem order. The first line must be `# <Topic Title>`.

### Adding a problem — checklist
1. Create the folder and the files above.
2. `npm run solution <slug>`: everything passes.
3. `npx vitest run problems/<topic>/<folder>`: the untouched stub fails.
4. `npm run check` and `npm run index`.

## Gotchas
- `INDEX.md` and `progress.json` are generated. Change the generators (`scripts/lib/index-md.js`) instead of editing the output.
- Don't rename a slug without migrating its key in `progress.json`.
- Pattern names must match `scripts/lib/patterns.js` exactly. To add a new pattern, add it there first.
- Keep everything dependency-free apart from Vitest.
- Inside Vitest workers, recursion overflows at roughly 7–10k frames. Inputs deeper than that deliberately rule out recursive solutions, so when a problem does that, say so in its Goal section and in the test name.
- Don't use `toBe`, `not.toBe` or `toBeInstanceOf` on list, tree or graph node objects. When they fail, Vitest tries to print the whole (possibly cyclic) structure, which can hang or overflow. Assert identity with `expect(a === b).toBe(true)` instead.
- `vitest.config.js` sets `diff.truncateThreshold` so a failed `toEqual` on a 100k-element array doesn't spend minutes building a diff. Keep it.
- If a big test would make a naive solution run for minutes, gate it behind a smaller timed test: when the small one fails, skip the big one with `ctx.skip()`, as some string DP problems do.
- `npm.apple.com` (the configured registry) is very slow at resolving optional peer dependencies. `.npmrc` sets `legacy-peer-deps=true`, which is why `vite` is listed explicitly in `devDependencies`.
