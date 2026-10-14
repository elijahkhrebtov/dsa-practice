# Hint 2

With **prefix sums**, `sum(i..j) = prefix[j+1] - prefix[i]`. A subarray ending at the current position sums to `k` exactly when some *earlier* prefix equals `currentPrefix - k`.

That's a lookup question, like Two Sum. But several earlier prefixes can share a value, and each one is a separate subarray. So a **hash map from prefix sum → how many times it has occurred** is the tool.
