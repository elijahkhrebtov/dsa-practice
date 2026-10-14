# Hint 1

Look at what each operation needs:

- `getRandom` in O(1) is easy if the elements sit in an **array**: pick a random index.
- `insert`/`remove` in O(1) need a fast "is it there, and where?", which an array can't answer.

Can you keep **two** structures in sync, so each operation uses the one that's good at it?
