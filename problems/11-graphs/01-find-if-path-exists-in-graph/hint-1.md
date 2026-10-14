# Hint 1

You need to answer "who are the neighbours of vertex `x`?" over and over. Scanning the whole `edges` list each time is far too slow. What structure answers that question directly? (Remember the edges go both ways.)

Also: the graph can contain cycles. How do you make sure you never process the same vertex twice?
