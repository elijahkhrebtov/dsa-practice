# Hint 2

Greedy: whenever you have a choice, run the available label with the **most remaining copies**. Keep the counts in a max-heap.

To avoid stepping through idle units one by one, work in **rounds of `n + 1` slots**. Within a round each label can run at most once, and after it every label is available again.
