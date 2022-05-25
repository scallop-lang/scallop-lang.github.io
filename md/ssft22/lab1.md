# Lab1 Instructions

Let's get our hands dirty with a simple project! This lab will guide you through a few basic Scallop syntax and concepts, including negation, aggregation, and recursion.

## Visual Question Answering (VQA)
Visual question and answering is an important task in the learning field. Let's learn about how to perform VQA with Scallop with this simple image.

<div>
 <img src="/img/summer_school/lab1/vqa_example.png" width="300"/>
</div>

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

<!-- // ## Extra Credits -->
