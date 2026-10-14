# Hint 2

After discarding the dead weight, the surviving elements are in **decreasing** order from left to right, and the first survivor is the window maximum.

Keep the survivors in a **deque of indices**. New elements enter at the back, and expired elements (those that slid out of the window) leave from the front. That's a monotonic deque.
