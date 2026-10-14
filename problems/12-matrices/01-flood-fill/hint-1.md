# Hint 1

Think of every pixel as a node in a graph, connected to its up/down/left/right neighbours **of the same original colour**. Which nodes does the paint bucket recolour?

Then ask yourself: once a pixel is painted, how can you tell it apart from one you haven't visited yet? What goes wrong with that idea when `color` is the same as the starting colour?
