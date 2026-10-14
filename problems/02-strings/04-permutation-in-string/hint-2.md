# Hint 2

Use a **fixed-size sliding window** over `s2` with a 26-slot **frequency array**. Moving the window by one only changes two counts: the letter entering on the right goes up by one, the letter leaving on the left goes down by one. No need to rebuild or sort anything.

Compare the window's counts with `s1`'s counts after each move. Comparing 26 numbers is O(26), so the whole scan is O(26·n).
