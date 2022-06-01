# Lab 1 Instructions

In this lab, we will go through the Scallop language and its reasoning backend.
We will start with a simple case study of Graph Algorithms.
Then, we will imagine that we are dealing with probabilistic scene graphs and
understand how to reason with probabilities.

# Graph Algorithms

In this module, we will learn to write simple graph algorithms in Scallop.
Download file [`graph_algo.scl`](/ssft22/labs/graph_algo.scl) and ensure that
you can execute it with Scallop:

```
$ scli graph_algo.scl
```

Initially, you should see that all the relations are empty:

```
> scli graph_algo.scl
source_node: {}
path: {}
triangle: {}
...
```

As we go through the exercises, you will see them being computed one by one!

## P1: Sample Graph

<div>
 <img src="/img/summer_school/lab1/graph_example.png" width="480"/>
</div>

We use two relations, `node` and `edge` to define the basic structure of the graph.

``` scl
type node(usize)
type edge(usize, usize)
```

The `node` relation is a unary relation that stores the node IDs.
And the `edge` relation defines whether there exists an edge between the first and second argument.

Fill in the facts for `node` and `edge` so that the instantiated sample graph resembles the
the graph shown above.
This graph will serve as the basis for our practice exercises.

``` scl
rel node = {/* Fill in the facts here */}
rel edge = {/* Fill in the facts here */}
```

You should be able to test whether the two relations are populated by running the following commands:

```
$ scli graph_algo.scl --query node
$ scli graph_algo.scl --query edge
```

> **Remark**:
> `usize` stands for "Unsigned Size Type", which in the most modern computer is a 64-bit unsigned integer type.
> While we can use other integer types such as `u8` (unsigned 8-bit integer) or
> `i32` (signed 32-bit integer), we will stick with `usize` for this lab.

## P2: Detect Triangles in the Graph

Next, write a simple query extracting (directed) triangles in the graph.
Notice that the three nodes 1, 2, and 4 form a triangle.
A directed triangle `abc` is defined when there is an edge from `a` to `b`, an edge from `b` to `c`, and an edge
from `c` back to `a`.
By this definition, our sample graph has three directed triangles: `triangle(1, 2, 4)`, `triangle(2, 4, 1)`, and `triangle(4, 1, 2`:

```
$ scli graph_algo.scl --query triangle
triangle: {(1, 2, 4), (2, 4, 1), (4, 1, 2)}
```

## P3: Path (Transitive Closure)

Now let us write a fundamental rule for reasoning about a graph:
Does there exist a path between node A and node B?

For this exercise, we define a new relation called `path(usize, usize)`.
We should be able to derive `path(a, b)` if there is a non-empty chain of edges that connects `a` to `b`.
Therefore, we should now define a recursive rule for `path`:
- If there is an edge from `a` to `b`, then there is a path from `a` to `b`;
- If there is an edge from `a` to `b` connected to a path from `b` to `c`, then there is a path from `a` to `c`.

To put into the context of our example, there should be a path from 1 to 3 (1 --> 2 --> 3), and a path from 1 to 1 (1 --> 2 --> 4 --> 1).
Note that `path` is directional. There should not be a path from 5 to 3.

Write the rule(s) for the `path` relation.
Note that you can either write two rules or one rule with an `or` inside of it.
Use the following command to execute the program:

```
$ scli graph_algo.scl --query path
```

The expected output should be as follows:

```
path: {(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (3, 5), (4, 1), (4, 2), (4, 3), (4, 4), (4, 5)}
```

## P4: Strongly Connected Component (SCC)

A strongly connected component (SCC) is defined as a subgraph within which every node is reachable from every other node.
In this exercise, we will define a relation called `scc(usize, usize)`:
`scc(a, b)` holds if node `a` and node `b` are in the same SCC.
Note that a node is always in the same SCC as itself.

In our sample graph, the nodes `1`, `2`, and `4` are in the same SCC. `3` and `5` are in their respective SCC.
You should execute the following command and see the expected output:

```
$ scli graph_algo.scl --query scc
scc: {(1, 1), (1, 2), (1, 4), (2, 1), (2, 2), (2, 4), (3, 3), (4, 1), (4, 2), (4, 4), (5, 5)}
```

## P5: Singleton SCC

We could have SCCs that contain only one node.  We call such SCC a "singleton SCC".
Write a rule to define `singleton_scc(usize)`, where the only argument is the only node ID inside that SCC.

> **Hint**:
> For this relation you might need to create a helper relation `non_singleton_scc`.
> Meanwhile, negation (with syntax like `~pred(...)`) might be needed.

Inside our sample graph, only nodes `3` and `5` belong to their respective singleton SCC.

```
$ scli graph_algo.scl --query singleton_scc
singleton_scc: {(3), (5)}
```

## P6: Source and Sink Node

Next, let's define notions of source and sink nodes as follows:
A node is a *source* if there is only an outgoing edge and no incoming edge.
A node is a *sink* if there is only an incoming edge and no outgoing edge.

Write two rules for `source_node(usize)` and `sink_node(usize)` that yield the following result
on our sample graph:

```
$ scli graph_algo.scl --query source_node
source_node: {}
$ scli graph_algo.scl --query sink_node
sink_node: {(5)}
```

> **Remark**:
> There is no source node in our sample graph, but you can slightly tweak the sample graph for this exercise to test
> the correctness.

## P7: Contains Cycle

In this exercise, we will detect whether there is a cycle inside our graph.
Formally, a cycle means that starting from a node, after a non-empty chain of edges we can go back to the same node.
The `contains_cycle(bool)` relation is defined to be an arity-1 relation with a boolean value as its only argument:
The fact `contains_cycle(true)` will be derived if there is a cycle, and `contains_cycle(false)` otherwise.

You might find the `exists` aggregation operator useful.
It has the following syntax:

``` scl
RESULT = exists(VARS*: LOGICAL_FORMULA)
```

where `RESULT` is assigned a boolean value indicating whether there exist binding variables `VARS*` such that they satisfy the `LOGICAL_FORMULA`.

> **Note**:
> `VARS*` means there could be multiple variables. `exists(a: ...)` or `exists(a, b: ...)` are all acceptable.
But for this exercise, we probably only need one.

After executing the program, you should get the following output:

```
$ scli graph_algo.scl --query contains_cycle
contains_cycle: {(true)}
```

## P8: Number of Nodes

In this exercise, we will continue our journey on aggregations.
This time, let us count the number of nodes in the graph.
As the name suggests, you will find the `count` aggregator helpful:

``` scl
RESULT = count(VARS*: LOGICAL_FORMULA)
```

This will count the number of unique `VARS*` and assign the count (of type `usize`) to the `RESULT` variable.
Again, `VARS*` means that there could be multiple variables.
But for this exercise, we probably only need one.

Here's the expected output after executing the rule:

```
$ scli graph_algo.scl --query num_nodes
num_nodes: {(5)}
```

## P9: Number of Edges

Similar to the previous exercise, we are going to use the `count` aggregator for the rule `num_edges(usize)`.
Different from the previous exercise, you might need to introduce more than one binding variable.
Here's the expected output:

```
$ scli graph_algo.scl --query num_edges
num_edges: {(5)}
```

## P10: In- and Out-Degree

For this exercise, we are going deeper into the `count` aggregation,
and figure out the in- and out-degree for every node in the graph.

In-degree is defined for each node as the number of incoming edges for that node.
Out-degree is defined also for each node as the number of outgoing edges for that node.
For example, node `2` has an in-degree of 1 (coming from node `1`) and an out-degree of `2` (going into nodes `3` and `4`).

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

Here is an extra credit exercise where you want to write a rule to compute the shortest path length between two nodes.
The definition is `shortest_path_length(usize, usize, usize)`
where `shortest_path_length(a, b, x)` means the shortest path length is `x` between node `a` and `b`.
For example, the shortest path between node `1` and `5` has length 3 (`1 --> 2 --> 3 --> 5`).
There could be a path between a node and itself, e.g. the shortest path between node `4` and `4` has length 3 (`4 --> 1 --> 2 --> 4`).

You might want to create a helper relation that stores the length of paths.
For this you would need to assume the shortest path length would be less than or equal to the total number of nodes in the graph,
to avoid computing for path lengths infinitely.
Lastly, a `min` aggregation would be needed to find the shortest length.

```
$ scli graph_algo.scl --query shortest_path_length
shortest_path_length: {(1, 1, 3), (1, 2, 1), (1, 3, 2), (1, 4, 2), (1, 5, 3), (2, 1, 2), (2, 2, 3), (2, 3, 1), (2, 4, 1), (2, 5, 2), (3, 5, 1), (4, 1, 1), (4, 2, 2), (4, 3, 3), (4, 4, 3), (4, 5, 4)}
```

# Visual Question Answering

Visual Question and Answering (VQA) is an important task in the machine learning and computer vision domain.
In a learning task, discrete facts are usually associated with probabilities.
For example, an object may have a 90% probability of being a red object, and 10% of being a green one.
Further, an object can only be red or green, but can't be red and green at the same time in this task.
To express this probabilistic property, we will guide you through how to use probabilistic facts with disjunctions in Scallop.


<div>
 <img src="/img/summer_school/lab1/CLEVR_example.png" width="300"/>
</div>

The VQA exercises will be in file [`scene_graph.scl`](/ssft22/labs/scene_graph.scl).

## P11: Probabilistic scene graph
In this exercise, we will simulate a situation where these facts come from a neural network.
To perform the VQA task, we first need to describe the image in a symbolic form, also known as the "scene graph".
The scene graph can have multiple object attributes, such as color, shape, and relations.
In this task, the colors of objects will be red, green, yellow, and blue; the shapes will be cube, sphere, and cylinder; the materials are metal and rubber; the sizes are big and small.

``` scl
rel all_colors = {/* Fill in the facts here */}
rel all_shapes = {/* Fill in the facts here */}
rel all_materials = {/* Fill in the facts here */}
rel all_sizes = {/* Fill in the facts here */}
```

The `obj_color`, `obj_shape`, `obj_size`, and `obj_material` relations define the color, shape, size, and material of each object; while the `left` relation defines a spatial relationship between two objects, where `left(a, b)` means `a` is on the left of `b`.

``` scl
type obj_color(usize, String)
type obj_shape(usize, String)
type obj_size(usize, String)
type obj_material(usize, String)
type left(usize, usize)
```

Please fill in the following facts and probabilities.
For `obj_color`, `obj_shape`, `obj_size`, and `obj_material`, write the probabilistic facts where each fact correctly represents the image above have 0.94 probability, and the rest of the facts are uniformly likely.
To observe how discrete facts interact with the probabilistic ones, we keep the `left` relation discrete.
``` scl
rel obj_color = {/* Fill in the probabilistic facts here */}
rel obj_shape = {/* Fill in the probabilistic facts here */}
rel left = {/* Fill in the discrete facts here */}
```

## P12: Right
Naturally, we can deduce a `right` relation from the `left` relation.
The definition of `right(a, b)` means `a` is on the right of `b`.
Please write the rule for `right(a, b)`, so that it can reflect the image.

## P13: Find blue objects
Let's write a simple query, extracting all the ids for the blue objects in the scene graph.
You shall execute the following command and obtain the same outputs.
```
$ scli scene_graph.scl -p minmaxprob --query blue_objs
blue_objs: {((1), 0.02), ((2), 0.94), ((3), 0.02), ((4), 0.02), ((5), 0.94)}
```

## P14: Color of cubes
Now we want to query for all the different colors of cubes in the image. Running the following command shall give you the expected result.
```
$ scli scene_graph.scl -p minmaxprob --query color_of_cubes
color_of_cubes: {(("blue"), 0.03), (("green"), 0.94), (("red"), 0.03), (("yellow"), 0.03)}
```

## P15: Count red objects
Let's try to perform aggregation, `count` over the probabilistic facts.
We want to count how many red objects are there in the image:
```
scli scene_graph.scl -p minmaxprob --query num_red_objects
num_red_objects: {((0), 0.06000000000000005), ((1), 0.94), ((2), 0.02), ((3), 0.02), ((4), 0.02), ((5), 0.02)}
```

## P16: Count objects by shape
We can also count the objects grouped by their shapes.
Here is the expected output of `how_many_object_of_each_shape`
```
scli scene_graph.scl -p minmaxprob --query how_many_object_of_each_shape
how_many_object_of_each_shape: {(("cube", 0), 0.06000000000000005), (("cube", 1), 0.94), (("cube", 2), 0.03), (("cube", 3), 0.03), (("cube", 4), 0.03), (("cube", 5), 0.03), (("cylinder", 0), 0.06000000000000005), (("cylinder", 1), 0.06000000000000005), (("cylinder", 2), 0.06000000000000005), (("cylinder", 3), 0.94), (("cylinder", 4), 0.03), (("cylinder", 5), 0.03), (("sphere", 0), 0.06000000000000005), (("sphere", 1), 0.94), (("sphere", 2), 0.03), (("sphere", 3), 0.03), (("sphere", 4), 0.03), (("sphere", 5), 0.03)}
```

## P17: Between
We want to find whether an object is between two objects.
The relation `between(a, b, c)` means `c` is in between object `a` and `b`.
```
scli scene_graph.scl -p minmaxprob --query between
between: {((1, 3, 2), 1), ((1, 4, 2), 1), ((1, 4, 3), 1), ((1, 5, 2), 1), ((1, 5, 3), 1), ((1, 5, 4), 1), ((2, 4, 3), 1), ((2, 5, 3), 1), ((2, 5, 4), 1), ((3, 5, 4), 1)}
```

## P18: Green between red and blue
Is there a green object between a red and a blue object?
The relation `between(a, b, c)` means `c` is in between object `a` and `b`.

> **Hint**:
> For this relation you might want to use the `between` relation.

```
scli scene_graph.scl -p minmaxprob --query g_between_r_and_b
g_between_r_and_b: {((false), 0.98), ((true), 0.02)}
```

## P19: CLEVR question
Here is a question from the CLEVR dataset corresponding to the image we give:
What is the color of the other big object that is made of the same material as the yellow thing?
```
scli scene_graph.scl -p minmaxprob --query clevr_q
clevr_q: {(("blue"), 0.06), (("green"), 0.94), (("red"), 0.06), (("yellow"), 0.06)}
```

## P20: Working with Different Tags
After finishing the above exercises, here are two questions for you to think about.
Does the probability for the query output match your expectation?
Can you try to explain why we obtain these probabilities?

Exact probabilistic reasoning is not the only way to perform the probabilistic calculation.
There are many methods to perform approximation and accelerate the speed of probabilistic reasoning.
We develop such methods using the [provenance semiring](https://repository.upenn.edu/cgi/viewcontent.cgi?article=1022&context=db_research) framework.
We will first define the tag space *T*, the *0* and *1* in *T*, and the binary operations *⊕*, *⊗*, and *⊖* to instrument how to combine the tags when "or", "and", and "not" take places in the fact space.
Note that when we are using the word "extended provenance semiring", we are referring to an extension of the [provenance semiring with negation](https://www.usenix.org/legacy/event/tapp11/tech/final_files/Amsterdamer.pdf).

There are multiple extended provenance semirings we provided to choose from, which have different expressiveness, precision, and efficiency.

|  Extended Provenance Semiring | Negation | Aggregation | Probabilistic | Precision |
| :--- | :----: | :----: | :----: | ---: |
| unit | True | True | False | N/A |
| minmaxprob | True | True | True | low |
| topkproofs | False | False | True | tunable |
| topbottomkclauses | True | True | True | tunable |

To select the extended provenance semiring, we have the `-p` option for both `scli` and `sclirepl`.
```
scli -p <semiring> <scl_file>
```

We can observe how the tags are calculated through `--debug-tag` provided by `scli`.
```
> scli scene_graph.scl -p minmaxprob -q num_red_objects --debug-tag
Tags of input relation `all_shapes`:
("cube"): 1
("sphere"): 1
("cylinder"): 1
...
num_red_objects: {((0), 0.06000000000000005), ((1), 0.94), ((2), 0.02), ((3), 0.02), ((4), 0.02), ((5), 0.02)}
```

In the `topbottomkclauses` semiring, the tags are DNF or CNF formulas with at most k clauses. This semiring will provide the most likely proof of the fact.
Please fill in the tags for the `g_between_r_and_b` under the `topbottomkclauses` semiring, and briefly explain how the probability of `g_between_r_and_b(False)` is calculated.
```
> scli scene_graph.scl -p topbottomkclauses -q num_red_objects --debug-tag
Tags of input relation `obj_color`:
(1, "red"): DNF{{Pos(0)}}
(1, "green"): DNF{{Pos(1)}}
(1, "blue"): DNF{{Pos(2)}}
(1, "yellow"): DNF{{Pos(3)}}
...
Tags of output relation `g_between_r_and_b`:
// TODO: Fill in the tags here
```

## P21: Provenance Comparison

Rerun the queries `num_red_objects`, `g_between_r_and_b`, and `how_many_object_of_each_shape`, each
with the `minmaxprob` semiring and the `topbottomkclauses` (abbreviated as `tbk` below) semiring of different top-k values.
Fill in the table below with the query outputs' probability.


| Extended Provenance Semiring | minmaxprob | tbk (k=1) | tbk (k=3) | tbk (k=10) |
| :--- | :----: | :----: | :----: | ---: |
| `num_red_objects(1)` |  |  |  |  |
| `num_red_objects(2)` |  |  |  |  |
| `g_between_r_and_b(True)` |  |  |  | |
| `g_between_r_and_b(False)` |  |  |  | |
| `how_many_object_of_each_shape("cube", 2)` |  |  |  | |
| `how_many_object_of_each_shape("cylinder", 3)` | | | | |
