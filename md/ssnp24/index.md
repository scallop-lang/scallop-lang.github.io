# Scallop Tutorial Summer 2024

# Introduction

This is the tutorial for [Summer school on Neurosymbolic Programming June 10-12, 2024](https://www.neurosymbolic.org/summerschool2024.html), hosted in Salem, Massachusetts, USA.

# Structure of Tutorial

This tutorial is going to be divided into two parts:
- Part 1: Get familiar with the Scallop by going through examples of discrete and probabilistic reasoning.
- Part 2: Combine Scallop with neural networks to solve tasks involving both perception and reasoning.
- Part 3: Combine Scallop with pre-trained foundation models to solve complex reasoning tasks without training.

# Getting Started

## Pre-requisites

- [Docker](https://www.docker.com): We will be using a docker image for the tutorial, please make sure that you have docker installed on your system.
- [VSCode](https://code.visualstudio.com): We recommend using VSCode during the tutorial. Additionally, please install the following extensions inside VSCode
  - [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for connecting with the docker container
  - [Scallop VSCode](https://marketplace.visualstudio.com/items?itemName=scallop-lang.scallop) for syntax highlighting of Scallop code

## Installation Instructions

This tutorial is available in Docker.
Please first clone the following [Github repository](https://github.com/scallop-lang/summer-school/).
Within it you will see a [Dockerfile](https://github.com/scallop-lang/summer-school/tree/main/x86_64/Dockerfile).
You can setup the Docker container using the following commands (build takes roughly ~20mins):

``` bash
docker build -t scallop-summer24-tutorial -f x86_64/Dockerfile .
docker run -it --name scallop-summer scallop-summer24-tutorial
```

After this, you should see the following prompt:

``` bash
(base) root@c36cbd85bb7b:~/labs$
```

Be sure to activate the conda environment with:

``` bash
conda activate scallop-env
```

To use OpenAI features, add the following line to the container's `~/.bashrc`.
Please make sure to replace the `<YOUR_OPENAI_KEY>` using your own which could be found in OpenAI official website if you have an OpenAI account.

```bash
export OPENAI_API_KEY="<YOUR_OPENAI_KEY>"
```

## Hello World!

Now, you might want to check if you can successfully run Scallop.
To verify that everything has been installed correctly, please run the following command, and see if the output matches:

``` bash
(base) root@c36cbd85bb7b:~/labs$ conda activate scallop-env
(scallop-env) root@c36cbd85bb7b:~/labs$ scallop part-0/hello.scl
hello: {("Hello World")}
```

If they match, you are off to a great start!

In the following parts of the tutorial, we will assume that you stay in the `/root/labs` directory with the `scallop-env` conda environment.
We will use `$` to replace the command line prompt.

# Part 1: Graph Reasoning Algorithm

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

# Part 2: PacMan Agent

In this part, we are going to use Scallop to help control a PacMan in a game called PacMan-Maze.
In the PacMan-Maze, we are dealing with simple 5x5 grids.
On each grid cell, there could be an enemy (ghost), a goal (flag), an actor (PacMan), or simply empty.
The goal of the game is to control the PacMan to go from its current location to the goal without hitting any enemy.
We are going to treat the PacMan-Maze as a graph with each cell being the node, so please be sure to utilize your knowledge learnt from Part 1!

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
We note that it is normal for the performance during training to stay low, as there are random explorations.

> Note: It is normal that we have low success rate during training due to forced random exploration.

# Part 3: Connecting to Foundation Models

In this part, we are going to connect Scallop to a few foundation models, namely [GPT](https://chatgpt.com), [Segment Anything Model](segment-anything.com), and [CLIP](https://github.com/openai/CLIP).
You'll need to make sure to obtain an OpenAI API Key for this purpose.
Once there is an OpenAI API Key, add the following line to your `~/.bashrc`:

``` bash
export OPENAI_API_KEY="<YOUR_OPENAI_KEY>"
```

## P1: Date Reasoning

The first application we are going to work on is reasoning about Dates.
In this task, your model should take in a string such as

> Jane finished her PhD in January 5th, 2008. 2 days from today is the 10th anniversary of her PhD. What is the date 10 days ago from today?

The answer that your model should produce is `"12/24/2017"`.
The reasoning goes as follows:

- Jane finished her PhD in January 5th, 2008;
- The 10th aniversary is January 5th, 2018;
- Today is 2 days before the 10th aniversary so today is January 3rd, 2018;
- 10 days ago from today is Dec 24, 2017.

Instead of directly calling a language model (e.g. GPT-4) for the answer, we are going to divide the whole task into two parts: perception and reasoning.
For the perception, we are simply going to read the question and note down the known facts.
We are going to use three Scallop relations to represent the facts (and also what the question is asking for):
`mentioned_date`, `relationship`, and `goal`.

The `mentioned_date` relation directly notes the concrete `Date` given a specific label.
Note that the label for each date can be automatically generated by the language model.
For the above question, there will be only one mentioned concrete `Date`:

```
mentioned_date: {("finish-phd", t"01/05/2008")}
```

The `relationship` relation notes down the relationships between date labels.
Concretely,

```
relationship: {
  ("finish-phd", "10th-anniversary", "10y"), // there is 10-year between Jane finishing PhD and her 10th anniversary
  ("10th-anniversary", "today", "-2d"), // today is 2 days before 10th anniversary
  ("10-days-ago", "today", "10d"), // We want to obtain the
}
```

Lastly, we will ask GPT to note down which date label is the exact date we want answer from.
In this case, we want to get the date 10 days ago:

```
goal: {("10-days-ago")}
```

All the prompts and relations are already settled in `part-3/date_understanding.scl`.
What you are going to work on is three rules inside of this file that derives dates from known facts.
Once you are done, you can use the command

``` bash
scallop part-3/date_understanding.scl
```

to run your rules.
This run is going to use the above mentioned example as the input question.
The output that you should see is:

```
answer: {(t"12/24/2017")}
```

If you want to try some other questions, you can run the command as the following

``` bash
scallop part-3/date_understanding.scl --question "Today is Jan 1, 2020, the first date I get my first monthly salary of $100. When am I going to earn $1000?"
```

## P2: Tracking Shuffled Object

We now work on another natural language reasoning task named tracking shuffled object.
In this task, your model should look at a natural language description about possession of items and swap between people.
At the end, we want to reason what item is possessed by some given people.
For instance, here is an example:

> Anthony, Ben, and Charles are playing a game. At the start of the game, they are each holding a ball: Anthony has a orange ball, Ben has a white ball, and Charles has a blue ball. \n\nAs the game progresses, pairs of players trade balls. Ben and Charles swap balls. But before that, Anthony and Ben swap balls. At the very end, Anthony and Ben swap balls. But at the very beginning of the game, Anthony and Charles swap balls. At the end of the game, Ben has the _____

The answer that your program should return is `white ball`.
Here is the reasoning behind:

| Round | Action              | Anthony | Ben    | Charles |
|-------|---------------------|---------|--------|---------|
| 0     | (Initial)           | orange  | white  | blue    |
| 1     | Anthony <-> Charles | blue    | white  | orange  |
| 2     | Ben <-> Anthony     | white   | blue   | orange  |
| 3     | Ben <-> Charles     | white   | orange | blue    |
| 4     | Anthony <-> Ben     | orange  | **white** | blue    |

You will be working on the `part-3/tracking_objects.scl`.
Within it you will see 3 TODOs:

1. Query the foundation model using the `@gpt_extract_info` attribute.
   For this part, you can go back to `part-3/date_understanding.scl` for syntax.
   Roughly, you should fill the prompt and the few-shot examples so that the foundation model can correctly extract the information from the given context.

2. Given the extracted information, write the rules that perform the reasoning of swaping objects.
   The rule should populate the `possessions` relation which stores the possessed object `object` at a given time point `t` by person `person`.

3. At the end, write a rule that uses the queried person name and the last time point to retrieve the answer.

After finishing the three TODOs, you can run the following command:

``` bash
scallop part-3/tracking_objects.scl
```

And you should get the following answer when running with the default input:

``` bash
answer: {("white ball")}
```

In order to run on other examples, you can pass the following argument in the command line

``` bash
scallop part-3/tracking_objects.scl --question "<YOUR QUESTION HERE>"
```

## P3: Visual Question Answering

Finally let's work on a multi-modal application, [CLEVR](https://cs.stanford.edu/people/jcjohns/clevr/).
