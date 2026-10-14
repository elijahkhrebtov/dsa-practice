# Hint 2

Scan left to right and keep two things for the current level: the string built so far and the number being read (digits can come several in a row, so `num = num * 10 + digit`).

Use a stack to save the paused outer levels:

- `[`: push the pair *(string so far, repeat count)*, then start the new level with an empty string and count 0.
- `]`: pop *(previous string, k)*. The current level becomes `previous + current repeated k times`.
- letter: append it to the current string.

Once the scan is done, the current string is the answer.
