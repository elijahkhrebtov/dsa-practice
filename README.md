# DSA Practice

A local collection of data structures & algorithms problems in plain JavaScript. You solve them in VS Code and check them with unit tests. Nothing to deploy.

👉 **Start with [INDEX.md](INDEX.md)**. It lists every problem with your progress, grouped by data type and by pattern.

## Setup

```sh
npm install
```

## Workflow

1. Open a problem, e.g. [`problems/03-hash-tables/01-two-sum/problem.js`](problems/03-hash-tables/01-two-sum/problem.js). Read the description at the top and implement the empty function.
2. Run its tests. The exact command is written in every problem file:
   ```sh
   npm run solve two-sum
   ```
   - Any failing test → marked 🟨 **attempted** in `INDEX.md`
   - All tests pass → marked ✅ **completed**
3. Stuck? Open `hint-1.md`, then `hint-2.md`, … in the same folder. `solution.js` has a fully explained reference solution.

## Commands

| Command | |
| --- | --- |
| `npm run solve <problem>` | Run a problem's tests and update your progress |
| `npm run watch <problem>` | Re-run the tests on every save |
| `npm run solution <problem>` | Run the tests against the reference solution |
| `npm run solve` | Show progress and the next problem |
| `npm run index` | Rebuild `INDEX.md` |

`<problem>` is the folder name without the number (`two-sum`), or any unique part of it (`npm run solve rain`).

**VS Code:** with a problem file open, run **Terminal → Run Task… → "DSA: solve current problem"**, or bind the default test task to a key. The recommended Vitest extension also works for running single tests, but runs started from the extension don't update `INDEX.md`.

**Start over on a problem:** replace the function body with `// Your code here` again. Tip: `git init && git add -A && git commit -m "start"` lets you reset any problem with `git checkout -- <file>`.

## Layout

```
problems/<NN-data-type>/README.md        primer on the data type
problems/<NN-data-type>/<NN-problem>/
  problem.js        ← you write code here
  problem.test.js   the tests
  hint-1.md …       progressive hints
  solution.js       explained reference solution
lib/                ListNode, TreeNode, PriorityQueue, … helpers you can import
```

See [AGENTS.md](AGENTS.md) for the full conventions.
