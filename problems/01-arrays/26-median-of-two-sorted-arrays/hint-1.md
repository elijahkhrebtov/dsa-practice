# Hint 1

The median splits the merged array into a **left half** and a **right half** of (almost) equal size, where everything on the left is `<=` everything on the right.

Suppose the left half takes the first `i` elements of `nums1`. How many elements must it then take from `nums2`? Notice that once `i` is chosen, the whole split is determined.
