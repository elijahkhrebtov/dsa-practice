# Hint 2

"Nearest shorter bar to the left / right" is a "previous / next smaller element" question, and the tool for that is a **monotonic stack**.

Scan the bars left to right and keep a stack of indices whose heights increase from bottom to top. When a bar arrives that is shorter than the top, that new bar is the **right boundary** of the top bar. And after you pop it, the element now underneath is its **left boundary**. You have everything you need to compute the top bar's rectangle right at the moment you pop it.
