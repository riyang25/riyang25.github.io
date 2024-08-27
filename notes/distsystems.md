# Distributed Systems and Algorithms
My notes for the fall 2024 CS:5620 class at the University of Iowa.
## Week 1
What are some examples of distributed systems?
- Internet
- web service
- cloud service (like AWS)
- cellular networks
- compute clusters
- sensor networks

Our goal is to design efficient and reliable distributed systems.

Three stages of distributed systems:
- The real world distributed system
- A simplified but realistic model
  - Often make worst case and pessimistic assumptions
- Design and analyze algorithms

This course will focus on the latter two stages.

### Puzzle
Consider a chain of n machines, connected with bidirectional communication links. Each machine has an unique ID from the set {0,1,...,n-1}. Assume that these are assigned adversarily - worst case for any algorithm we decide to implement. Our goal: design an algorithm that runs as fast as possible and computes a proper coloring of the machines that uses as few colors as possible.

**What is a proper coloring?**
A proper coloring is a function P: {0,1,...,n-1} -> {0,1,...,k-1}, such that for two adjacent machines m and m', P(m) =/= P(m').

Our goal is to minimize k, while still running the algorithm as fast as possible.

**What does fast mean?**
We need a model of computation: LOCAL
- every machine knows its ID and nothing else at the start
- every machine knows and can communicate over ports with neighboring machines, knows how many ports it has
- machines have access to a global clock - this is a synchronous network
- each tick of clock, each machine
  - performs an arbitrary computation with local information (what it knows at the time)
  - sends (possibly distinct) messages to neighbors
  - receives messages from neighbors
- We can assume all three happen instantly at each clock tick
  - This is because in the real world, 
- together, we call this a *round*

The goal is to have the algorithm execute in as few rounds as possible.

#### Possible heuristics
**N colors**
If each machine gives itself a color equal to its id, it's a valid proper coloring. This is instant, but not very useful as an algorithm

**2 colors**
Start from leftmost machine, give it color 0. Then iterate through chain, alternating between 1 and 0.
Issues:
- How do we know which one is the leftmost? That machine will have only one port, but so does the rightmost
- runs as O(n)

**Higher ID**
Often, we don't want neighbors to do the same thing

Heuristic: if my ID is higher than that of all my neighbors, I can choose color

Example:
2 - 1 - 4 - 0 - 3

2, 4, and 3 are higher than neighbors, and choose color 0
they then go idle

1 and 0 are left, and have no active neighbors

they choose lowest color now available, 1

Issues:
- Adversarial ordering: 0 - 1 - 2 - 3 - 4
- Our algorithm will run as O(n) on this ordering

