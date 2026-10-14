# Hint 1

Imagine you already know a valid split of `s`. Look at its **last** word: what must be true about the part of `s` before it?

Now picture plain recursion on `"aaaaaaaaab"` with the words `"a"`, `"aa"`, `"aaa"`. How many different ways are there to arrive at "the rest of the string starts at index 6"? Does the answer for that suffix ever change?
