# Hint 1

If a window `nums[left..right]` qualifies, every smaller window inside it qualifies too. So you can grow the window on the right and shrink it from the left only when it breaks the rule. That's a variable-size sliding window.

What's left is answering "what are the max and min of the current window?" quickly while elements enter on the right and leave on the left. Recomputing them each time is too slow.
