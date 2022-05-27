# Lab 1 Instructions

In this first lab we will go through the Scallop language and its reasoning backend.
We are going to start with a simple case studies of Graph Algorithms.
Then, we are going to study the representation of a Visual Scene Graph and be able to reason about the scene graph.
Lastly, we are going to imagine that we are dealing with probabilistic scene graphs and understand how to reason with probabilities.

# Graph Algorithms

In this module we are going to learn to write simple graph algorithms with Scallop language.
We are going to be relying on the file [`graph_algo.scl`](/ssft22/labs/graph_algo.scl).
First of all, please make sure that you download the file and can use `scli` to execute it:

```
$ scli graph_algo.scl
```

Initially, you should see that all the relations are empty:

```
> scli ssft22/labs/graph_algo.scl
source_node: {}
path: {}
triangle: {}
...
```

As we go through the problems, you will see them being computed one-by-one!

## P1: Sample Graph

<div>
  <img src="/img/summer_school/lab1/graph_example.png" width="480"/>
</div>

We are using two relations, `node` and `edge` to define the basic structure of the graph.

``` scl
rel node(usize)
rel edge(usize, usize)
```

The `node` relation is a unary relation which stores the node IDs.
And the `edge` relation defines whether there exists an edge between the first and second argument.

Please fill in the facts for `node` and `edge` so that the instantiated sample graph resembles the
graph shown above.
This graph will serve as the basis for our practice problems.

``` scl
rel node = {/* Fill in the facts here */}
rel edge = {/* Fill in the facts here */}
```

You should be able to test whether the two relations are populated by running the following command:

```
$ scli graph_algo.scl --query node
$ scli graph_algo.scl --query edge
```

> **Remark**:
> `usize` stands for "Unsigned Size Type", which in most modern computer is a 64-bit unsigned integer type.
> While we can use other integer types such as `u8` (unsigned 8-bit integer) or
> `i32` (signed 32-bit integer), let's stick with `usize` for this lab.

## P2: Detect Triangles in the Graph

Let us write a simple query extracting (directed) triangles in the Graph.
As you can see the three nodes 1, 2, and 4 form a triangle.
A directed triangle `abc` is defined when there is edge from `a` to `b`, edge from `b` to `c`, and an edge
from `c` back to `a`.
By this definition, we will have three directed triangles: `triangle(1, 2, 4)`, `triangle(2, 4, 1)`, and `triangle(4, 1, 2`:

```
$ scli graph_algo.scl --query triangle
triangle: {(1, 2, 4), (2, 4, 1), (4, 1, 2)}
```

## P3: Path (Transitive Closure)

Now we are going to write the most fundamental rule for reasoning about a graph:
Does there exist a path between node A and node B?

For this problem we define a new relation called `path(usize, usize)`.
We should be able to derive `path(a, b)` if there is a non-empty chain of edges that connects `a` to `b`.
Therefore, we should now define a recursive rule for `path`:
- If there is an edge from `a` to `b`, then there is a path from `a` to `b`;
- If there is an edge from `a` to `b` connected to a path from `b` to `c`, then there is a path from `a` to `c`.

To put into the context of our example, there should be a path from 1 to 3 (1 --> 2 --> 3), and a path from 1 to 1 (1 --> 2 --> 4 --> 1).
Note that `path` is directional. There should not be a path from 5 to 3.

Please write the rule for `path` relation.
Note that you could either write two rules or one rule with an `or` inside of it.
You should use the following to execute the program

```
$ scli graph_algo.scl --query path
```

And this should be the expected output

```
path: {(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (3, 5), (4, 1), (4, 2), (4, 3), (4, 4), (4, 5)}
```

## P4: Strongly Connected Component (SCC)

A strongly connected component (SCC) is defined as a subgraph within which every node is reachable from every other node.
In this problem we are trying to define a relation called `scc(usize, usize)`:
`scc(a, b)` holds true if node `a` and node `b` are in the same SCC.
Note that a node is always in the same SCC as itself.

In our sample graph, the nodes `1`, `2` and `4` are in the same SCC. `3` and `5` are in their respective SCC.
You should execute the following command and see the expected output:

```
$ scli graph_algo.scl --query scc
scc: {(1, 1), (1, 2), (1, 4), (2, 1), (2, 2), (2, 4), (3, 3), (4, 1), (4, 2), (4, 4), (5, 5)}
```

## P5: Singleton SCC

We could have SCCs that contain only one node and we call such SCC a "singleton SCC".
Please write a rule to define `singleton_scc(usize)`, where the only argument is the only node ID inside that SCC.

> **Hint**:
> For this relation you might need to create a helper relation `non_singleton_scc`.
> Meanwhile, negation (with syntax like `~pred(...)`) might be needed.

Inside of our sample graph, only node `3` and `5` belong to their respective singleton SCC.

```
$ scli graph_algo.scl --query singleton_scc
singleton_scc: {(3), (5)}
```

## P6: Source and Sink Node

We give the following definition for source and sink node:
A node is a *source* if there is only outgoing edge and no incoming edge.
A node is a *sink* if there is only incoming edge and no outgoing edge.
Please write two rules for `source_node(usize)` and `sink_node(usize)` so that it can yield the following result
with our sample graph:

```
$ scli graph_algo.scl --query source_node
source_node: {}
$ scli graph_algo.scl --query sink_node
sink_node: {(5)}
```

> **Remark**:
> There is no source node in our sample graph, but you can slightly tweak the sample graph for this problem to test
> the correctness.

## P7: Contains Cycle

In this problem we are going to detect whether there is a cycle inside of our graph.
Formally, a cycle means that starting from a node itself, after a non-empty chain of edges we can go back to the same node.
The `contains_cycle(bool)` relation is defined to be an arity-1 relation with a boolean value as its only argument:
The fact `contains_cycle(true)` will be derived if there is a cycle, `contains_cycle(false)` otherwise.

You might find the `exists` aggregation very useful.
It has a syntax of

``` scl
RESULT = exists(VARS*: LOGICAL_FORMULA)
```

`RESULT` is assigned a boolean of whether there exist binding variables `VARS*` such that they satisfy the `LOGICAL_FORMULA`.

> **Note**:
> `VARS*` means there could be multiple variables. `exists(a: ...)` or `exists(a, b: ...)` are all acceptable.
> Though for this problem, we probably only need one variable.

After executing the program, you should get the following output:

```
$ scli graph_algo.scl --query contains_cycle
contains_cycle: {(true)}
```

## P8: Number of Nodes

In this problem we are going to continue our journey on aggregations.
This time, let's count the number of nodes in the graph.
As the name suggests, you will find the `count` aggregator very useful:

``` scl
RESULT = count(VARS*: LOGICAL_FORMULA)
```

This will count the number of unique `VARS*`, and assign the count (of type `usize`) to the `RESULT` variable.
Again, `VARS*` means that there could be multiple variables.
But for this problem, we probably only need one.

Here's the expected output after executing the rule:

```
$ scli graph_algo.scl --query num_nodes
num_nodes: {(5)}
```

## P9: Number of Edges

Similar to the previous problem, we are going to use the `count` aggregator for the rule `num_edges(usize)`.
Different than previous problem, you might need to introduce more than one binding variables.
Here's the expected output:

```
$ scli graph_algo.scl --query num_edges
num_edges: {(5)}
```

## P10: In- and Out-Degree

For this problem we are going deeper into the `count` aggregation,
and figure out the in- and out-degree for every node in the graph.

In-degree is defined for each node as the number of incoming edges for that node.
Out-degree is defined also for each node as the number of outgoing edges for that node.
For example, the node `2` has in-degree of 1 (coming from node `1`) and out-degree of `2` (going into node `3` and `4`).

The relation `in_degree(usize, usize)` is defined as an arity-2 relation.
The first argument denotes the node ID, and the second argument represents the number of incoming edges for that node.

You would find the following *explicit group-by* syntax very helpful:

``` scl
rel in_degree(a, x) = x = count(VARS*: FORMULA where a: node(a))
```

This will make sure that all the node `a` in our sample graph gets to be involved in the counting.
Otherwise, the nodes with, say, 0 in-degree might not appear in the final result.

```
$ scli graph_algo.scl --query in_degree
in_degree: {(1, 1), (2, 1), (3, 1), (4, 1), (5, 1)}
$ scli graph_algo.scl --query out_degree
out_degree: {(1, 1), (2, 2), (3, 1), (4, 1), (5, 0)}
```

## EC1: Shortest Path Length

Here is an extra credit problem where you want to write rule to compute the shortest path length between two nodes.
The definition is `shortest_path_length(usize, usize, usize)`
where `shortest_path_length(a, b, x)` means the shortest path length is `x` between node `a` and `b`.
For example, the shortest path between node `1` and `5` has length 3 (`1 --> 2 --> 3 --> 5`).
There could be path between a node and itself, e.g. the shortest path between node `4` and `4` has length 3 (`4 --> 1 --> 2 --> 4`).

You might want to create a helper relation which stores the length of paths.
For this you would need to assume the shortest path length would be less than or equal to the total number of nodes in the graph,
to avoid computing for path lengths infinitely.
Lastly, a `min` aggregation would be needed to find the shortest length.

```
$ scli graph_algo.scl --query shortest_path_length
shortest_path_length: {(1, 1, 3), (1, 2, 1), (1, 3, 2), (1, 4, 2), (1, 5, 3), (2, 1, 2), (2, 2, 3), (2, 3, 1), (2, 4, 1), (2, 5, 2), (3, 5, 1), (4, 1, 1), (4, 2, 2), (4, 3, 3), (4, 4, 3), (4, 5, 4)}
```

# Visual Scene Graph

Visual Question and Answering (VQA) is an important task in the machine learning and computer vision domain.
Usually people represent an image using a scene graph, where we have

<div>
 <img src="/img/summer_school/lab1/vqa_example.png" width="300"/>
</div>

<!--

### Facts
To perform the VQA task, we first need to describe the image in a symbolic form, also known as the "scene graph". The scene graph can have multiple object attributes, such as color, shape, and relations. We first construct a scene graph that contains the color information.

``` scl
// declare the type of the relations
type object_color(usize, String)
type left(usize, usize)

// declare the input facts
rel object_color(0, "red")
rel object_color(1, "green")
rel object_color(2, "green")

rel left(0, 1)
rel left(0, 2)
rel left(1, 2)
```

We can also construct the relation in a set form. For example, we can write the size information as follows:
``` scl
rel object_shape = {
 (0, "cube"),
 (1, "cube"),
 (2, "sphere"),
}

rel left = {(0, 1), (0, 2), (1, 2)}
```

### Query
Let's write the query for our first question!

Question: Which objects are green in the scene graph?
``` scl
// declare rules
type green_obj(usize)
rel green_obj(x) = object_color(x, "green")
```

To output the specific relation in Scallop, we can put the query in the Scallop program itself:
``` scl
// declare the desired output query relation
query green_obj
```

We can also use the command line argument `-q` to instrument the desired output relationship:
```
scli <sclfile> -q <query relation>
```

### Negation
Question: Which objects are not green in the scene graph?

The syntax for negation is `~` in scallop.
``` scl
type not_green_obj(usize)
rel not_green_obj(x) = object_color(x, _), ~green_obj(x)
```

### Count
Question: How many green objects are there in the image?

We will use the `count` syntax in Scallop:
`r1(<usize>) = <usize> = count(<element>: r2(<element>))`.

``` scl
type how_many_green(usize)
rel how_many_green(x) = x = count(o: object_color(o, "green"))
```

### Exist
Question: Does there exist any blue object in the image?

We will use the `exists` syntax in Scallop:
`r1(<bool>) = <bool> = exists(<element>: r2(<element>))`.

``` scl
type exists_green_obj(bool)
type exists_blue_obj(bool)
rel exists_green_obj(b) = b = exists(o: object_color(o, "green"))
rel exists_blue_obj(b) = b = exists(o: object_color(o, "blue"))
```

### Group by
Question: For each possible color, does there exist a cube in that color?
Suppose there are three possible colors: "green", "red", and "blue".
``` scl
rel color = {
 ("red"),
 ("green"),
 ("blue"),
}
```

We will use the `where` syntax in Scallop:
``` scl
rel exists_cube_among_color(c, x) = x = exists(o: object_shape(o, "cube"), object_color(o, c) where c: color(c))
```

Note the difference between using group by and without group by:
```
rel exists_cube_color(c, x) = x = exists(o: object_shape(o, "cube"), object_color(o, c))
```

The execution result for `group by` has the fact, that there is no blue object in the scene, while the pure join doesn't.
```
exists_cube_color: {("green", true), ("red", true)}
exists_cube_among_color: {("blue", false), ("green", true), ("red", true)}
```

### Probabilitistic Facts
In a learning task, the facts are usually associated with probabilities.
For example, an object may have a 90% probability of being a red object, and 10% of being a green one.
Further, an object can only be red or green, but can't be red and green at the same time in this task.
To express this probabilistic scene graph, we can use probabilistic facts with a disjunction in Scallop.

``` scl
rel object_color = {0.9::(0, "red"); 0.1::(0, "green")}
rel object_color = {0.2::(1, "red"); 0.8::(1, "green")}
rel object_color = {0.1::(2, "red"); 0.9::(2, "green")}
```


### Tag Space
When we jump into the probabilistic world, we want to associate each fact with its probabilistic information using the tag system.
We will first define the tag space *T*, the *0* and *1* in *T*, and the binary operations *⊕*, *⊗*, and *⊖* to instrument how to combine the tags when "or", "and", and "not" take places in the fact space.
Note that when we are using the word provenance semiring, we are actually referring to an extension of the provenance semiring with negation. //TODO: cite

The default `unit` provenance semiring does not propagate any tag information during the reasoning process.
- *T = ()*
- *0 = ()*
- *1 = ()*
- *⊕ = λ(x, y)=>()*
- *⊗ = λ(x, y)=>()*
- *⊖ = λ(x)=>()*

Another provenance semiring `minmaxprob` propagates the probability of the most influential input fact to the deduced fact.
- *T = [0, 1]*
- *0 = 0*
- *1 = 1*
- *⊕ = λ(x, y)=> min(1, x + y)*
- *⊗ = λ(x, y)=> x ✕ y*
- *⊖ = λ(x)=>1-x*

There are multiple provenance semirings we provided to choose from, they have different expressiveness, precision, and efficiency.

| provenance semiring | Negation | Aggregation | Probabilistic | Precision |
| :--- | :----: | :----: | :----: | ---: |
| unit | True | True | False | N/A |
| minmaxprob | True | True | True | low |
| topkproofs | False | False | True | tunable |
| topbottomkclauses | True | True | True | tunable |

To select the provenance semiring, we have the `-p` option for both `scli` and `sclirepl`.
```
scli -p <semiring> <scl_file>
```

We can observe how the tags are calculated through `--debug-tag` provided by `scli`.
```
> scli -p minmaxprob labs/lab2_prob_semiring/scl/3_count_green_obj.scl --debug-tag
Tags of input relation `object_color`:
(0, "red"): 0.9
(0, "green"): 0.1
(1, "red"): 0.2
(1, "green"): 0.8
(2, "red"): 0.1
(2, "green"): 0.9
...
Tags of input relation `how_many_green`:
how_many_green: {((0), 0.09999999999999998), ((1), 0.19999999999999996), ((2), 0.8), ((3), 0.1)}
```

In the `topbottomkclauses` semiring, the tags are DNF or CNF formulas with at most k clauses. This semiring will provide the most likely proof to the fact.
```
> scli -p topbottomkclauses labs/lab2_prob_semiring/scl/3_count_green_obj.scl --debug-tag
Tags of input relation `object_color`:
(0, "red"): DNF{ {Pos(0)} }
(0, "green"): DNF{ {Pos(1)} }
(1, "red"): DNF{ {Pos(2)} }
(1, "green"): DNF{ {Pos(3)} }
(2, "red"): DNF{ {Pos(4)} }
(2, "green"): DNF{ {Pos(5)} }
...
Tags of output relation `how_many_green`:
(0): DNF{ {Neg(1), Neg(3), Neg(5)} }
(1): DNF{ {Neg(1), Neg(3), Pos(5)}, {Neg(1), Pos(3), Neg(5)}, {Pos(1), Neg(3), Neg(5)} }
(2): DNF{ {Neg(1), Pos(3), Pos(5)}, {Pos(1), Neg(3), Pos(5)}, {Pos(1), Pos(3), Neg(5)} }
(3): DNF{ {Pos(1), Pos(3), Pos(5)} }
```

### VQA Practice
Here is a visual question and answer pair from the CLEVR dataset.
Write one deterministic and one probabilistic Scallop program to answer this question.

<div>
 <img src="/img/summer_school/lab1/CLEVR_test_000014.png" width="400"/>
</div>

1. Find the object id of the blue objects.
2. Find all the possible colors of cubes.
3. How many red objects are there in the scene?
4. How many objects are there for each shape?
5. Find whether an object is between two objects.
   - Definition: `between(a, b, c)` means `c` is in-between object `a` and `b`
6. Is there a green object between a red and a blue object?
7. What is the color of the other big object that is made of the same material as the yellow thing?

## Graph
The graph is not only crucial in computational theory and algorithms, but also an important aspect in the learning field, such as knowledge graph.
We will showcase how to work with a simple graph using Scallop.

<div>
 <img src="/img/summer_school/lab1/graph_example.png" width="300"/>
</div>

### Facts

``` scl
type edge(usize, usize)
rel edge :- {(1, 2), (2, 4), (4, 1), (2, 3), (3, 5)}
```

### Recursion
Question: Does there exists a path between two nodes?

To answer this question, we need to define a recursive relation, called `path`.
A recursive relation requires a base case and an inductive case.
The inductive case will use the relation itself in the body definition.

``` scl
rel path(a, b) = edge(a, b)
rel path(a, b) = path(a, x) and edge(x, b)
```

### Graph Practice
1. Find the triangles in this graph.
    - Definition: `triangle(a, b, c)` means the nodes a, b, and c form a triangle.
2. Write an `scc` relationship.
    - Definition: `scc(a, b)` means node `a` and `b` are in the same Strongly Connected Component
    - Definition: Strongly Connected Component is a subgraph where any node can reach every node in such a component
     - Note: A node is always in the same Strongly Connected Component as itself
3. Find the SCCs that are singleton.
     - Definition: `singleton_scc(a)` means node `a` stays in a Strongly Connected Component that only contains itself
4. Does this graph contains at least one cycle?
     - Definition: `contains_cycle(true)` means the graph contains a cycle. false otherwise
5. Count the number of nodes.
     - Definition: `num_nodes(n)` means there are in total `n` nodes in the graph
6. Write a `in_degree` relationship.
     - Definition: `in_degree(a, x)` means there are `x` edges going into node `a`
7. Write a `out_degree` relationship.
    - Definition: `out_degree(a, x)` means there are `x` edges going out from node `a`
8. Count the number of nodes within 3 steps of node `n`.
     - Definition: `num_nodes_within_3(n, c)` means there are `c` nodes that are reachable from `n`
9. Shortest Path Length.
     - Definition: shortest_path_length(a, b, n): n is the length of the shortest path between node `a` and `b`
     - Note: Need to use the fact that any path length will be less than or equal to the total number of nodes in the graph

// ## Extra Credits -->
