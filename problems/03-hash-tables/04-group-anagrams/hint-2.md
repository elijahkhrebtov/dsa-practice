# Hint 2

Build a **canonical key** for each string, then group with a **hash map** from key → list of strings.

Two easy keys: the string's letters **sorted** ("tea" → "aet"), or the **26 letter counts** joined into a string. If you go with counts, join them with a separator, or different counts can produce the same key.
