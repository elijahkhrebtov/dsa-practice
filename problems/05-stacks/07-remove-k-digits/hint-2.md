# Hint 2

Greedy rule: whenever a digit is **bigger than the digit right after it**, deleting it makes the number smaller. Deleting the first such digit is the best single deletion you can make.

Doing that k times with a rescan from the start each time is O(n·k). Instead, keep the digits you've decided to keep on a stack that stays **non-decreasing**. A new digit can knock several bigger digits off the top, one removal each, while you still have removals left.
