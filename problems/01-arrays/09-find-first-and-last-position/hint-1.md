# Hint 1

Finding *some* index of the target is plain binary search. The problem is the run around it: if the target fills almost the whole array, walking left and right from that index costs O(n).

Instead of searching for "an index holding the target", can you binary search directly for the **boundary** where the run begins? What should happen when `nums[mid] === target`?
