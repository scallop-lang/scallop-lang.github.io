# Instructions - Tutorial @PLDI'23

Our tutorial is for you to get familiar with the Scallop language in different scenarios.
At a high level, the tutorial is divided into three parts.
Part 0 gives instructions on installing the docker environment.
Part 1 teaches you how to do logical and probabilistic reasoning with Scallop, in the context of graph algorithms (Part 1A) and visual question answering (Part 1B).
Part 2 shows Scallop combined with neural components on two neurosymbolic applications: evaluating hand-written formula (Part 2A) and playing our PacMan-Maze game (Part 2B).

For each sub-part, we have divided the work into multiple sub-problems (e.g., P1, P2, etc.)
They are designed to be completed in sequence, but you are free to jump to the next part (or sub-part) if you want.
We also provide the solution and the documentation in case they are needed:

<center>
  <a class="link-button big" href="https://github.com/moqingyan/scallop-pldi23-tutorial-solutions" target="_blank">Solution</a>
  <a class="link-button big" href="https://scallop-lang.github.io/doc" target="_blank">Documentation</a>
</center>

# Part 0: Getting Started

We provide a docker image for the tutorial that contains skeleton code for each of the three hands-on exercises.
Follow the step-by-step guide that details how to set up and run the tutorial docker which is hosted on dockerhub.
Please also find our slides which contain the overview and concepts of our talk. The following is a quick-start guide to get you up and running.

## Pre-requisites

- [Docker](https://www.docker.com): We will be using a docker image for the tutorial, please make sure that you have docker installed on your system.
- [VSCode](https://code.visualstudio.com): We recommend using VSCode during the tutorial. Additionally, please install the following extensions inside VSCode
  - [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for connecting with the docker container
  - [Scallop VSCode](https://marketplace.visualstudio.com/items?itemName=scallop-lang.scallop) for syntax highlighting of Scallop code

## Installation Instructions

The docker file for this tutorial is provided right here:

<center>
  <a class="link-button big" href="https://drive.google.com/drive/folders/1PzxSlR4EJ-APaTvsgi8A-eC7ffSlA7E9?usp=share_link" target="_blank">Download Tutorial Docker File</a>
</center>

Please download the `scallop-pldi23-docker.zip` file onto your local computer, and uncompress it.
There will be two possible docker images that you can choose from, one for `x86_64` machine and another for `aarch64` machine.
For people who use an x86_64 machines, please use the `Dockerfile` under `x86_64`.
For people who use Arm 64-bit systems, including Apple's M1/M2 Mac, please use the `Dockerfile` under `aarch64`.
In either case, go to the command line, stay in the root of the uncompressed folder, and build the docker image:

``` bash
# If you are using x86_64 machine
docker build -t scallop-pldi23-tutorial -f x86_64/Dockerfile .

# If you are using arm machine (including Mac with M1/M2 chip)
docker build -t scallop-pldi23-tutorial -f aarch64/Dockerfile .
```

Once this is done, we can run the docker image and turn that into a container:

``` bash
docker run -it --name my-scallop-container scallop-pldi23-tutorial
```

After this, you should see the following prompt:

``` bash
(base) root@c36cbd85bb7b:~/labs$
```

meaning that you have successfully launched our docker container.
After verifying that things go well, we can safely quit the docker by pressing `Ctrl + D`.
From here, we want to launch the docker through [VSCode](https://code.visualstudio.com).
Assuming that you have the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) plugin installed, you can navigate to the `Remote Explorer` tab on the sidebar, and attach a new VSCode window to the docker by clicking on the rightward arrow as shown in this screenshot:

<center>
  <img src="/img/pldi23/loading-docker-in-vscode.png" width="400px" />
</center>

If everything goes well, you can click on the "Open Folder" button in the sidebar under the `Explorer` tab.
We will choose to open the `/root/labs/` folder, as shown in the following screenshot:

<center>
  <img src="/img/pldi23/open-folder-in-vscode.png" width="760px" />
</center>

## Hello World!

Now, you might want to check if you can successfully run Scallop.
To verify that everything has been installed correctly, please run the following command, and see if the output matches:

``` bash
(base) root@477103f84e48:~/labs$ conda activate scallop-env
(scallop-env) root@477103f84e48:~/labs$ scli part-0/hello.scl
hello: {("Hello World")}
```

If they match, you are off to a great start!

In the following parts of the tutorial, we will assume that you stay in the `/root/labs` directory with the `scallop-env` conda environment.
We will use `$` to replace the command line prompt.

# Part 1A: Graph Reasoning Algorithm

In this module, we will learn to write simple graph algorithms in Scallop.
Please navigate to the `part-1` folder and open the file `graph_algo.scl`.

``` bash
$ scli part-1a/graph_algo.scl
```

Initially, you should see that all the relations are empty:

``` bash
$ scli part-1a/graph_algo.scl
source_node: {}
path: {}
triangle: {}
...
```

As we go through the exercises, you will see them being filled one by one!

## P1: Sample Graph

<center>
  <img src="/img/summer_school/lab1/graph_example.png" width="480px"/>
</center>

We use two relations, `node` and `edge` to define the basic structure of the graph.

``` scl
type node(node_id: usize)
type edge(from_id: usize, to_id: usize)
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

``` bash
$ scli part-1a/graph_algo.scl --query node
$ scli part-1a/graph_algo.scl --query edge
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

``` bash
$ scli part-1a/graph_algo.scl --query triangle
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

``` bash
$ scli part-1a/graph_algo.scl --query path
```

The expected output should be as follows:

```
path: {(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (3, 5), (4, 1), (4, 2), (4, 3), (4, 4), (4, 5)}
```

## P4: Strongly Connected Component

A strongly connected component (SCC) is defined as a subgraph within which every node is reachable from every other node.
In this exercise, we will define a relation called `scc(usize, usize)`:
`scc(a, b)` holds if node `a` and node `b` are in the same SCC.
Note that a node is always in the same SCC as itself.

In our sample graph, the nodes `1`, `2`, and `4` are in the same SCC. `3` and `5` are in their respective SCC.
You should execute the following command and see the expected output:

``` bash
$ scli part-1a/graph_algo.scl --query scc
scc: {(1, 1), (1, 2), (1, 4), (2, 1), (2, 2), (2, 4), (3, 3), (4, 1), (4, 2), (4, 4), (5, 5)}
```

## P5: Source and Sink Node

Next, let's define notions of source and sink nodes as follows:
A node is a *source* if there is only an outgoing edge and no incoming edge.
A node is a *sink* if there is only an incoming edge and no outgoing edge.

Write two rules for `source_node(usize)` and `sink_node(usize)` that yield the following result
on our sample graph:

``` bash
$ scli part-1a/graph_algo.scl --query source_node
source_node: {}
$ scli part-1a/graph_algo.scl --query sink_node
sink_node: {(5)}
```

> **Remark**:
> There is no source node in our sample graph, but you can slightly tweak the sample graph for this exercise to test
> the correctness.

## P6: Contains Cycle

In this exercise, we will detect whether there is a cycle inside our graph.
Formally, a cycle means that starting from a node, after a non-empty chain of edges we can go back to the same node.
The `contains_cycle(bool)` relation is defined to be an arity-1 relation with a boolean value as its only argument:
The fact `contains_cycle(true)` will be derived if there is a cycle, and `contains_cycle(false)` otherwise.

You might find the `exists` aggregation operator useful.
It has the following syntax:

``` scl
RESULT := exists(VARS*: LOGICAL_FORMULA)
```

where `RESULT` is assigned a boolean value indicating whether there exist binding variables `VARS*` such that they satisfy the `LOGICAL_FORMULA`.

> **Note**:
> `VARS*` means there could be multiple variables. `exists(a: ...)` or `exists(a, b: ...)` are all acceptable.
> But for this exercise, we probably only need one.

After executing the program, you should get the following output:

``` bash
$ scli part-1a/graph_algo.scl --query contains_cycle
contains_cycle: {(true)}
```

## P7: Number of Nodes

In this exercise, we will continue our journey on aggregations.
This time, let us count the number of nodes in the graph.
As the name suggests, you will find the `count` aggregator helpful:

``` scl
RESULT := count(VARS*: FORMULA)
```

This will count the number of unique `VARS*` and assign the count (of type `usize`) to the `RESULT` variable.
Again, `VARS*` means that there could be multiple variables.
But for this exercise, we probably only need one.

Here's the expected output after executing the rule:

``` bash
$ scli part-1a/graph_algo.scl --query num_nodes
num_nodes: {(5)}
```

## P8: Number of Edges

Similar to the previous exercise, we are going to use the `count` aggregator for the rule `num_edges(usize)`.
Different from the previous exercise, you might need to introduce more than one binding variable.
Here's the expected output:

```
$ scli part-1a/graph_algo.scl --query num_edges
num_edges: {(5)}
```

## P9: In- and Out-Degree

For this exercise, we are going deeper into the `count` aggregation,
and figure out the in- and out-degree for every node in the graph.

In-degree is defined for each node as the number of incoming edges for that node.
Out-degree is defined also for each node as the number of outgoing edges for that node.
For example, node `2` has an in-degree of 1 (coming from node `1`) and an out-degree of `2` (going into nodes `3` and `4`).

The relation `in_degree(usize, usize)` is defined as an arity-2 relation.
The first argument denotes the node ID, and the second argument represents the number of incoming edges for that node.

You would find the following *explicit group-by* syntax very helpful:

``` scl
rel in_degree(a, x) = x := count(VARS*: FORMULA where a: node(a))
```

This will make sure that all the node `a` in our sample graph gets to be involved in the counting.
Otherwise, the nodes with, say, 0 in-degree might not appear in the final result.

```
$ scli part-1a/graph_algo.scl --query in_degree
in_degree: {(1, 1), (2, 1), (3, 1), (4, 1), (5, 1)}
$ scli part-1a/graph_algo.scl --query out_degree
out_degree: {(1, 1), (2, 2), (3, 1), (4, 1), (5, 0)}
```

# Part 1B: Visual Question Answering

In this part, we are going to study Scallop with it's probabilistic programming capability.
We are going to do it through an example of *Visual Question Answering*.
Let's look at the following picture:

<center>
  <img src="/img/pldi23/scene-graph-cartoon.png" width="480px"/>
</center>

The picture depicts 4 objects roughly aligned horizontally, with different colors and shapes.
With the picture, people would like to ask simple questions such as "how many blue objects are there on the image."
In such scenario, how could a (probabilistic) database possibly be used to answer such questions?

We thus introduce two structured representations: *Scene Graph* (SG), and *Scene Graph Query Language* (SGQL).
The scene graph is used to represent the objects, their attributes, and relationships on the image, while the scene graph query language is to systematically answer questions related to scene graph.

Note that for real life computer vision applications, scene graphs are usually generated from images by *Scene Graph Generators* (SGG), while queries are generated from natural language text by *Semantic Parsers*.
In addition, the real life scene graphs and scene graph query languages are way more complicated than what we will be demonstrating.
Here, we provide a demonstration of how Scallop can be integrated to solve such kind of problems.

In this part, we are going to be only modifying the file `part-1b/scene_graph.scl`.

## P1: Probabilistic Scene Graph

In this exercise, we want to manually fill in the probabilistic scene graph that represents the image.
Specifically, our scene graph consists of three types of information:

1. Objects (in our case, `A`, `B`, `C`, and `D`, as shown in the picture)
2. Attribute of Objects (the color and shape of each object)
3. Spacial Relations (wheter an object is on the left or right of another object)

For the first part, let us assume that the four objects are given.
We have created helper constant variables for the 4 objects, and have included them in the `object` unary-relation:

``` scl
const A = "A", B = "B", C = "C", D = "D"
rel object = {A, B, C, D}
```

This suggests that we are going to only consider the four objects.

For the second part, we have two binary relations: `obj_color` and `obj_shape` that connects objects with their corresponding attributes.
Note that we have already pre-defined the domain of colors and shapes.
For example, we would have a fact `obj_color(A, BLUE)` since object `A` is blue.
However, we want to fill them with probabilities.
Imagine that a trained neural network processes the image and predicts the color of the object `A`, it would be of color `BLUE` of highest probability (say 0.95), while having low probability for it being `RED` or `YELLOW`.

**Your Task:**
Please fill these probabilistic facts into the two relations `obj_color` and `obj_shape`.
We can use the `PROBABILITY :: TUPLE` syntax to specify each fact inside of the set.
Please put some reasonable probabilities (like 0.95, 0.03, etc.) for such facts.
Take `obj_color` as an example, since there are 4 objects and 3 possible colors, we should have 12 facts inside of the relation, all tagged by probabilities.

In order to see the probabilistic output, we run `scli` with an additional argument `--provenance topkproofs`.
This will enable probabilities to be processed along the computation.
Here is a sample output by running our solution.
Note that your probabilities could be different than ours.

```
$ scli part-1b/scene_graph.scl --provenance topkproofs --query obj_color
obj_color: {0.03::("A", 0), 0.02::("A", 1), 0.95::("A", 2), 0.01::("B", 0), 0.9::("B", 1), 0.09::("B", 2), 0.06::("C", 0), 0.02::("C", 1), 0.92::("C", 2), 0.95::("D", 0), 0.02::("D", 1), 0.03::("D", 2)}
```

We have filled the `obj_relation` for you.
In particular, it is defined by manually specifying the `LEFT` relation while deriving `RIGHT` relation.
For simplicity, we have made this relation non-probabilistic.

## P2: Scene Graph Query Language

Now, to answer questions of our scene graph, we define our simple Scene Graph Query Language (SGQL)!
Specifically, the domain specific language is defined using Algebraic Data Type (ADT) feature in Scallop:

``` scl
type Query = Scene()
           | FilterColor(Query, Color)
           | FilterShape(Query, Shape)
           | FilterRelate(Query, Relation)
           | Count(Query)
           | Exists(Query)
```

This simple language consists of 6 constructs.
When evaluating queries in this language, `Scene`, `FilterColor`, `FilterShape`, and `FilterRelate` returns selected objects.
The `Count` query will return a number (`usize`), and the `Exists` query will return a boolean (`bool`).

To familiarize ourselves with manipulating the data structure, let's first write a pretty-printer for this language.
We have provided the `color_to_string`, `shape_to_string`, `relation_to_string` helper relations, and the goal is to fully define the `query_to_string(e: Query, s: String)` relation that turns a query `e` to a string `s`.
For this, we have provided also the function for two variants: `Scene` and `FilterColor`:

``` scl
rel query_to_string(e, "Scene()") = case e is Scene()
rel query_to_string(e, $format("FilterColor({}, {})", eps, cs)) = case e is FilterColor(ep, c) and query_to_string(ep, eps) and color_to_string(c, cs)
```

For these rules, we are using the `case ... is ...` syntax to match on ADT variants.
The first rule says that if an expression `e` is a `Scene()` expression, then the pretty-printed expression is `"scene()"`.
The second rule matches on the case where expression `e` is a `FilterColor(ep, c)`.
Here, we invoke `query_to_string` and `color_to_string` to get the pretty-printed string for the two child nodes.
To combine the strings, we use a *foreign function* `$format` to generate a string.
Note that we the latter arguments will be used to fill in the `{}` in the format strings one-by-one.

**Your Task:** Please finish the pretty-printer by handling all other cases.
Once done, run the following file and see if the same pretty-printed string can be derived:

```
$ scli part-1b/test_pretty_print.scl
query_to_string(MY_QUERY, s): {(entity(0x8b4c97028e798acd), "Exists(FilterColor(FilterShape(Scene(), sphere), red))")}
```

## P3: Writing the Evaluator for SGQL

Now, let's define the semantics of our SGQL.
The evaluators for `Count` and `Exists` are special as they return number or boolean, and we have provided them as reference.
Here, we focus on the `eval_obj(e: Query, o: Object)` relation which denotes that object `o` is in the outcome set produced by executing query `e`.
In particular, we want you to fill in the evaluators for `FilterShape` and `FilterRelate` expressions.
The evaluators for `Scene` and `FilterColor` expressions are provided as example,

``` scl
rel eval_obj(e, o) = case e is Scene() and object(o)
rel eval_obj(e, o) = case e is FilterColor(ep, c) and eval_obj(ep, o) and obj_color(o, c)
```

The `Scene()` expression, when invoked, returns a set of all the objects in the scene graph.
This means that given an `object(o)`, it is going to be in the resulting set.
Pretty straight-forward.

The `FilterColor(Query, Color)` expression performs filter on the resulting set of a sub-expression, specifically using a given color.
This means that when we are evaluating a `FilterColor` expression, we want to recursively evaluate the output set of objects on the sub-expression, and then additionally apply a color constraint on the object.
This is realized by the `obj_color(o, c)` as seen in the rule: we are requiring that an object `o` to have the color `c`, in order for it to appear in the outcome of a `FilterColor` exrpression.

With what we have already, we can try running the following file:

```
$ scli part-1b/test_eval_1.scl --provenance topkproofs
query_to_string(MY_QUERY, s): {1::(entity(0xaeb1d99b81cd0265), "Count(Scene())")}
result(MY_QUERY, r): {1::(entity(0xaeb1d99b81cd0265), "4")}
```

In particular, `MY_QUERY` is `Count(Scene())`, which means counting all the object in the seen.
The execution result is `4` with a probability of `1.0`, as expected.

**Your Task:** please implement the evaluator by handling the `FilterShape` and `FilterRelate` cases!

You can run the following files to check the correctness of your implementation.
For `test_eval_2`, the result with the highest probability is 2, since there are likely 2 blue objects shown in the picture.

```
$ scli part-1b/test_eval_2.scl --provenance topkproofs
query_to_string(MY_QUERY, s): {
  1::(entity(0x70f877c280018a3a), "Count(FilterColor(Scene(), blue))")
}
result(MY_QUERY, r): {
  0.0035308000000000015::(entity(0x70f877c280018a3a), "0"),
  0.10803859999999998::(entity(0x70f877c280018a3a), "1"),
  0.7821303999999999::(entity(0x70f877c280018a3a), "2"),
  0.10036559999999999::(entity(0x70f877c280018a3a), "3"),
  0.0023597999999999996::(entity(0x70f877c280018a3a), "4")
}
```

For `test_eval_3`, the result with the highest probability is `true`, since there is a red cube (object `D`).

```
$ scli part-1b/test_eval_3.scl --provenance topkproofs
query_to_string(MY_QUERY, s): {
  1::(entity(0x3dd544fef993f62), "Exists(FilterColor(FilterShape(Scene(), cube), red))")
}
result(MY_QUERY, r): {
  0.048207060000000045::(entity(0x3dd544fef993f62), "false"),
  0.9148908844800001::(entity(0x3dd544fef993f62), "true")
}
```

# Part 2A: Hand-written Formula

In this part, we are going to combine a Scallop program with simple vision neural networks to *evaluate hand-written formula* (HWF).
The input given to this task is a list of images, where each image contains a hand-written digit or symbol.
For example, the following figure shows 5 symbols representing the formula `1 + 3 / 5`:

<center>
  <img src="/img/hwf/banner.png" width="360px" />
</center>

This would be evaluated to `1.6667`, which is a floating point number.
Here, the digits could be `0`-`9`, while the symbol could be among `+`, `-`, `*`, and `/`.

Our solution to this task is divided into two parts:
1. a neural component that classifies each image into one of the 14 possible symbols
2. a reasoning component that takes the probabilistic distributions and compute the most likely evaluated outcome.

To combine the two, there is a Python file that handles the full training end-to-end.
The project is thus structured with two files:

- `part-2a/src/run.py` the driver code for training and evaluating our HWF solution. It includes the neural component (`SymbolCNN`) and also the combined model (`HWFNet`). Inside of `HWFNet`, we also initialize the Scallop module, which is loaded from the following file:
- `part-2a/src/hwf.scl` the Scallop file for logically parse and evaluate a sequence of predicted symbol distributions.

We have provided the full `run.py` file which includes all the dataset, model architecture, and training pipeline.
You job is simply to implement the `hwf.scl` file.
In P1, you can implement the evaluator and test it against manually crafted instances.
In P2, we battle test it by training an end-to-end model!

## P1: Formula Parser and Evaluator

In order to write a formula parser and evaluator, we first understand the input and output format.

**Input Relations:**

The type definition of the input is organized as follows:

``` scl
type length(len: usize)
type symbol(id: usize, sym: String)
```

There are two input relations, `symbol` and `length`.

- The `length` relation is a unary relation storing a single fact containing the number of symbols in a formula.
For the motivating example `1 + 3 / 5`, the length will be `5`.

- The `symbol` relation is a binary relation denoting a mapping between the index of the symbol and the actual symbol itself.
The index of the symbol goes from `0` to `length - 1`, and the actual `sym` is a `String` which could possibly be `"0"`-`"9"`, `"+"`, `"-"`, `"*"`, and `"/"`.

For a concrete example of how the input facts look like, you can take a look at `part-2a/src/test_discrete.scl` and `part-2a/src/test_probabilistic.scl`.

**Output Relations:**

The type definition of the output is defined as

``` scl
type result(f32)
```

The `result` is a unary relation containing the derived output.
Considering the motivating example, `1.6666667` would be inside of the `result` relation.

**Intermediate Relations:**

In order to go from the input relations `symbol` and `length` to the output relation `result`, we also help you outline some intermediate relations.
We recommend following such skeleton relation type definitions and define concrete rules to these relations.
You can certainly try other ways if you want.

- `rel digit = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"}`, this is a helper unary-relation which functions as a set of all digit symbols. You can use this relation to match individual symbol that is a digit.

In order to parse the formula with the correct symbol precedence, we follow the following context free grammar (CFG):

```
TERM      := 0 | ... | 9
MULT_DIV  := TERM
           | MULT_DIV * TERM
           | MULT_DIV / TERM
ADD_MINUS := MULT_DIV
           | ADD_MINUS + MULT_DIV
           | ADD_MINUS - MULT_DIV
```

Note that we are only dealing with single digit expressions (i.e., we don't have constant numbers of more than 1 digit, like the `15` in `1 5 + 3`).
According to this CFG, we create three intermediate relations, each representing a parsed node of `term`, `mult_div`, or `add_minus` types.

- `type term(value: f32, begin: usize, end: usize)`
- `type mult_div(value: f32, begin: usize, end: usize)`
- `type add_minus(value: f32, begin: usize, end: usize)`

Each of them have three arguments, `value`, `begin`, and `end`.
The `value` argument is a `f32` (floating point 32-bit), representing the evaluated result given the current node.
The `begin` and `end` arguments are `usize`, which are the beginning index (inclusive) and the ending index (exclusive) of the current parsed node.

> REMARK: You might find the `[string] as f32` expression helpful, which parses a string into a floating point number.

**Your Task:**

In short, please implement rules for `term`, `mult_div`, `add_minus`, and finally the `result` relations.
In order to test your implementation, you can run the two test files, one for discrete inputs and another for probabilistic inputs.
Feel free to modify the test cases just to test your implementation more thoroughly.

Discrete inputs:

```
$ scli part-2a/test_discrete.scl
result: {(8)}
```

Probabilistic inputs:

```
$ scli part-2a/test_probabilistic.scl --provenance topkproofs
result: {0.063::(0.125), 0.020870000000000003::(0.5), 0.14428000000000002::(2), 0.50696::(8), 0.027999999999999997::(32)}
```

## P2: Training End-to-End

There is not much to do other than just training our neurosymbolic model for evaluating hand-written formulae!
Assuming that you have tested the behavior of your evaluator, and that the `conda` environment is correctly set to `scallop-env` simply run the following command and see the learning happen!

``` bash
$ python part-2a/run.py
```

Information about the training should be logged properly to the command-line, which will look like

```
[Train Epoch 1] Avg loss: 1.1658, Accuracy: 475/3000 (15.83%): 100%|██████| 188/188 [01:18<00:00,  2.38it/s]
[Test Epoch 1] Avg loss: 0.8975, Accuracy: 362/1000 (36.20%): 100%|█████████| 63/63 [00:07<00:00,  8.22it/s]
[Train Epoch 2] Avg loss: 0.8761, Accuracy: 1336/3000 (44.53%): 100%|█████| 188/188 [01:17<00:00,  2.44it/s]
[Test Epoch 2] Avg loss: 0.6267, Accuracy: 668/1000 (66.80%): 100%|█████████| 63/63 [00:07<00:00,  8.01it/s]
[Train Epoch 3] Avg loss: 0.8279, Accuracy: 1929/3000 (64.30%): 100%|█████| 188/188 [01:18<00:00,  2.40it/s]
[Test Epoch 3] Avg loss: 0.4156, Accuracy: 818/1000 (81.80%): 100%|█████████| 63/63 [00:07<00:00,  7.97it/s]
[Train Epoch 4] Avg loss: 0.5198, Accuracy: 2257/3000 (75.23%): 100%|█████| 188/188 [01:18<00:00,  2.40it/s]
[Test Epoch 4] Avg loss: 0.2866, Accuracy: 866/1000 (86.60%): 100%|█████████| 63/63 [00:08<00:00,  7.79it/s]
[Train Epoch 5] Avg loss: 0.4405, Accuracy: 2424/3000 (80.80%): 100%|█████| 188/188 [01:17<00:00,  2.43it/s]
[Test Epoch 5] Avg loss: 0.2708, Accuracy: 901/1000 (90.10%): 100%|█████████| 63/63 [00:08<00:00,  7.82it/s]
```

Once you can get a >80% test accuracy at around 3rd epoch, congratulations, your neurosymbolic program is working and helping to train the underlying perceptual neural networks!

> Note: While watching the model train could be fun, you can also jump to the next part!

# Part 2B: PacMan Agent

In this part, we are going to use Scallop to help control a PacMan in a game called PacMan-Maze.
In the PacMan-Maze, we are dealing with simple 5x5 grids.
On each grid cell, there could be an enemy (ghost), a goal (flag), an actor (PacMan), or simply empty.
The goal of the game is to control the PacMan to go from its current location to the goal without hitting any enemy.

<center>
  <img src="/img/pacman/pacman-game.png" width="480px" />
</center>

While the game seem easy, the catch is that our controller could only see the game as image.
Therefore, we propose to use Scallop as a neurosymbolic solution here.
As shown by the model architecture below, we decompose the problem into separated perception and reasoning parts.
The perception module, `EntityExtractor`, processes the image to extract entities and their position distributions.
These probabilistic distributions are then passed to the `PathPlanner`, which is a reasoning module written in Scallop.
It is the `PathPlanner`'s job to predict the next action to take, with the hope that the PacMan reach the goal eventually.

<center>
  <img src="/img/pacman/pacman-arch.png" width="480px" />
</center>

Notice that there is no supervision given on what the entities are despite indirect ones such as the rewards to the actions.
Initially, the perception model has no idea about how does each entity look like.
The joint neurosymbolic model need to learn from scratch on what things are and decide logically on where to go (what action to take).

We have provided three files:

- `part-2b/arena.py`: this file contains the game environment; you do not need to touch it
- `part-2b/run.py`: this is the main driver file written in Python for training the agent under an reinforcement learning (RL) environment.
  It contains the `EntityExtractor` model and also loads the Scallop module `PathPlanner` that we have as a separate file.
- `part-2b/path_planner.scl`: this is the file that you are going to be working with. It should encode the logic that chooses the optimal action in order for the PacMan to reach the goal.

## P1: Implement the Agent

Let us again study the input and output relations inside `part2b/path_planner.scl`.

**Input Relations:**

The listed relations here are the input relations to the `PathPlanner`.
They store coordinates with `x` and `y` ranging from `0` to `4` (since the grids are 5 by 5).

The `grid_node` one is an auxiliary relation containing all the nodes `(0, 0)`, `(0, 1)`, ..., `(4, 4)`, each tagged by 0.99.
This can be used for penalizing long paths.

``` scl
// Static input facts
type grid_node(x: usize, y: usize)
```

In terms of `actor`, `goal`, and `enemy`, they are, as their name suggests, the coordinates of corresponding type of entity.

``` scl
// Input from neural networks
type actor(x: usize, y: usize)
type goal(x: usize, y: usize)
type enemy(x: usize, y: usize)
```

**Output Relation:**

The output relation of the path planner is a relation named `next_action`.
It is a unary relation with `Action` as the only argument.
Note that `Action` is a enum type with four constants, `UP`, `RIGHT`, `DOWN`, and `LEFT`.

``` scl
type Action = UP | RIGHT | DOWN | LEFT
type next_action(Action)
```

**Your Task:**

We give skeleton code to guide you on implementing the path planner from the input relation to output relation.

``` scl
// (x, y) is a safe node if it is a grid node and does not contain an enemy
type safe_node(x: usize, y: usize)

// There is an (safe) edge between safe nodes (x1, y1) and (x2, y2) if
// taking the action `a` can move the actor from (x1, y1) to (x2, y2)
type edge(x1: usize, y1: usize, x2: usize, y2: usize, a: Action)

// There is a (safe) path between safe nodes (x1, y1) and (x2, y2) if
// there is a series of safe edges connecting the two nodes.
// Note that self-path is also a safe path.
type path(x1: usize, y1: usize, x2: usize, y2: usize)

// Given the current actor position, taking the action `a` would move the
// actor to the position (x, y)
type next_position(a: Action, x: usize, y: usize)

// We pick the action `a` as the next action if, after moving to the next
// position with `a`, we have a safe path from the next position to the goal
type next_action(a: Action)
```

Please implement a few rules for the 5 relations, `safe_node`, `edge`, `path`, `next_position`, and `next_action`.
For `edge` and `path`, they should look fairly similar to what we have done in Part-1A.

If you want, you can also ignore the provided skeleton and implement your own path planner!

## P2: Let the Agent Play!

In order to shorten the time required to train the model, we provide a pre-trained model for the `EntityExtractor`.
This means that you can directly run the whole model with your own `PathPlanner` and see the PacMan controlled by your program!

Note that working with VSCode and Docker can allow the game environment to be displayed:

<center>
  <img src="/img/pacman/pacman-display.png" width="200px" />
</center>

In order to look at your path planner at work, we can use the following command.

```
$ python part-2b/run.py --load-model part-2b/model/entity_extractor.pkl --phase test --show-run --show-run-interval 0.1
```

If everything goes correctly, you should see the PacMan moving straight to the goal for every single session of the game.
Here, we have loaded a pre-trained model of entity extractor.
We have also set the phase to be `test`, since we don't want training to happen.
Lastly, we specify that we want to `--show-run`, which will open a separate small window.
The `--show-run-interval` is a number in seconds to specify the delay in time of each action.
If not specified, the PacMan would move so fast that you can't catch what is happening.

In case the display is not supported due to unknown reasons, we can still run the testing by removing the `--show-run` and `--show-run-interval` flags.

```
$ python part-2b/run.py --load-model part-2b/model/entity_extractor.pkl --phase test
```

## P3: Train the Agent! (Optional)

If there is still time left and if you are interested, feel free to train the model from scratch!
You can run the script

```
$ python part-2b/run.py --phase train
```

This is one example training log produced

```
[Train Epoch 1] Avg Loss: 0.010963364504277706, Success: 17/50 (34.00%): 100%|█| 50/50 [01:48<00:00,  2.
[Test Epoch 1] Success 200/200 (100.00%): 100%|███████████████████████| 200/200 [00:18<00:00, 10.76it/s]
[Train Epoch 2] Avg Loss: 0.014583811163902283, Success: 24/50 (48.00%): 100%|█| 50/50 [01:57<00:00,  2.
[Test Epoch 2] Success 198/200 (99.00%): 100%|████████████████████████| 200/200 [00:18<00:00, 10.98it/s]
```

As can be seen, after only 50 episodes of training, our model can obtain an almost perfect accuracy.

> Note: It is normal that we have low success rate during training due to forced random exploration.
