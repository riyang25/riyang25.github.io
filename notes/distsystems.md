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

Some pseudocode for this algorithm:
```
active = true
color = undef
active1 = true, active2 = true
color1 = undef, color2 = undef

send ID to neighbors

while active
    find out (active, color) values of neighbors
    respond to requests from neighbors
    if myID > IDs of all active neighbors
        color = smallest color available (considering color of neighbors)
        active = false
```
Requires theta(n) in worst case, uses three colors

#### Cole & Vishkin Algorithm
There is an algorithm that solves the problem in log* n + 3 iterations!

A result from Linial: no algorithm that solves in fewer than 1/2 log* n iterations

**What is log\* n?**

We will assume that log means the base-2 log. Let log^(i) x = log(log(log...x)), that is, applying the log i times. log* x is smallest i such that log^(i) x is less than or equal to 1.

**Cole-Vishkin Iteration**

Assumption: machines have a consistent sense of direction, i.e., know what is the right and left. 

Suppose we have machine m, and its successor, succ(m). Initially, set the color equal to the machine ID. Compare the color of m and succ(m), as written in binary. Find the index of the rightmost digit that differs. Machine m sets its new color as this index, concatenated with the differing bit.

For example: ID(m) = 259 and ID(succ(m)) = 675.
- 259 = 100000011_2
- 675 = 1010100011_2
- The index which they differ at is 5, or 101_2
- Concatenate this with 0
- new color is 1010_2

Overall idea of the algorithm:
- start off with proper coloring that assigns color = ID; this is instant
- repeatedly apply Cole-Vishkin iterations to reduce pallete size rapidly
- Each iteration, the new coloring remains a proper coloring!
- In log* n iterations, we can reduce pallete size to 6
- From there, we do 3 slow iterations to reduce pallete size from 6 to 3

**What do we do for the rightmost machine without a successor?**

This machine pretends it has a successor whose color differs from it in the rightmost bit.

**Proving Correctness**

Let P_old be a proper coloring of the machines. P_new is obtained from P_old via a Cole-Vishkin iteration. Then P_new is a proper coloring.

Proof: Suppose we do have two adjacent colors that are the same in P_new: color(m) and color(m'). So m differs from m' at index k and has differing bit l. So P_new(m) = 2k + l. m' differs from its successor, m'', also at index k and has the *same* differing bit l. However, this means that m and m' don't have differing bits at index k. This is a contradiction! So it is impossible for two adjacent colors to be the same in P_new, and thus P_new is a proper coloring.

**Proving that Pallete Size Reduces Quickly**

First, a note: the algorithm assumes each machine knows how many machines there are in total.

Let m = log* n. Our condition is that m >=4. (Otherwise, n<=16 and it is a separate case.) For integer i, 0 <= i <= m-3, after i iterations of Cole-Vishkin, pallete size is at most 4 log^(i) n.

Proof: Suppose pallete size is k. We use at most ceiling(log k) bits to represent the color; this is the number of possible indices. There are two possible values of the differing bit. So in total, after we perform the iteration, there will be 2 * ceiling(log k) colors. 

We will proceed by induction.
- Let i = 0. This is trivial
- Assume that we have performed i iterations and size_i is less than 4 log^(i) n. Then size_(i+1) <= 2 * ceiling(log(4 log^(i) n)) <= 2 * (3 + log^(i+1) n) = 6 + 2 log^(i+1) n. 
- We need to prove that log^(i+1) n >= 3. Observe that log^(m-1) n > 1, from the definition of log* n. Then log^(m-3) n > 4. By hypothesis i+1 <= m-3, so log^(i+1) > 4. This completes our proof.

**Why can we only reduce pallete size to 6?**

Consider the color 101. If the color of its successor is 001, then its new color will remain 101. Thus, the pallete stops shrinking.
## Week 2
### Finishing Up Cole-Vishkin for Oriented Paths
**Lemma: if m>=4, after m iterations, pallete size <= 6**

Proof: after m-3 iterations, size < 4 log^(m-3) n < 64. After applying another iteration, the pallete size is bound by 2 log 64 = 12, then 2 log 12 = 8, then 2 log 8 = 6. 

**Slow Iterations**

All machines with color 5 recolor themselves with the smallest available color. Repeat for colors 4 and 3, and we are done.

### Extending to Oriented Trees
An oriented tree is a tree (connected acyclic graph with no cycle) where each node knows its parent. 

Lemma: there is an algorithm that can 6-color an oriented tree in log * n rounds. This is easy, Cole-Vishkin still works.

How do we reduce to 3 colors from here?
**Slow Iteration**

To remove color 5:
- shift colors down; each machine adopts the color of its parent. The root node picks the lowest available color.
- every machine colored 5 recolors itself using the smallest available color.
## Week 3
### LOCAL and CONGEST Models
To review:

LOCAL:
- bidirectional communication links
- each machine knows its own ID, and knows that it has distinguishable ports
  - sometimes we will add global knowledge, like the number of nodes, the maximum degree, or the diameter of the network
- each machine only does its portion of the output

If the network has n modes, IDs are represented using ceiling(c log n) bits for a constant c >=1.

The CONGEST model is exactly the same as the LOCAL model, except now we impose a limit on the size of one message; essentially, it can contain O(1) IDs.

**T-hop neighborhood**
The T-hop neighborhood of a node is the subgraph of nodes with distance less than or equal to T. Suppose we run an algorithm that takes T rounds on a graph. Suppose we change the ID of a node outside the T-hop neighborhood of v. Then the output at v cannot be different, because information can only propagate a distance of T during the execution of the algorithm.

**Triangle Counting Problem**
Every node should know how many triangles are in its neighborhood (nodes it is connected to.)

In the LOCAL model, this is easy.
- round 1: send ID to all neighbors
- round 2: send list of neighbors to all neighbors
- round 3: compute the number of triangles

In the CONGEST model, we can't send the list of neighbors in a single message. So the maximum runtime depends on the max degree of the network.

### Extending Cole-Vishkin to general graphs
Our goal is to find a delta+1 coloring; delta is the max degree.

Outline of process:
- paritition the graph into delta oriented forests.
- color each forest using 3 colors using Cole-Vishkin
- Merge the colorings of the delta forests into a single coloring

**Decomposition**

View each edge as oriented from lower to higher ID. (So nodes start by sending their IDs to each other.)

Every node v with degree(v) ports, labels its ports arbitrarily as 1, 2, ..., deg(v).

The forest i is induced by the edges leaving ports i. 

Theorem: there is an algorithm that can (delta+1) - color a general graph in O(log* n + delta^2) rounds. 

Good for small delta; worst case, runs in O(n^2) (one node connected to every other node)

finish section later

### Lower and Upper Bounds
Theorem: there is no deterministic LOCAL algorithm that can 3-color an oriented path using less than 1/2 log * n - 2 rounds.

Note that for this problem, we have matching upper and lower bounds! this is very rare

Finding lower bound is very hard, since we need to prove that all possible algorithms cannot do better. Finding an upper bound only requires discovering better and better algorithms

### Digression into random algorithms
With randomness we can potentially achieve much better performance than deterministic algorithms. 
- node picks temporary color uniformly randomly from availbel colors
- if neighbors don't pick same color, choose it as permanent

The probability of successfully picking a different color is at least 1/3. In expectation, at least n/3 nodes will successfuly finalize their color on the first round. So on average, this runs in O(log n) rounds. Worst case scenario is exceedingly rare.

## Week 4
