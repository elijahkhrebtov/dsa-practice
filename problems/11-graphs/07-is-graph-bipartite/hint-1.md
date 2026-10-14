# Hint 1

Pick any node and paint it red. Its neighbours are then *forced* to be blue, their neighbours forced to be red, and so on — you never actually have a choice inside one connected piece.

So the only question is: while spreading these forced colours, do you ever meet an edge whose two ends were forced to the **same** colour?

And what about nodes your spreading never reached?
