## Pathfinder, Long Range Connectivity Reasoning

In this task, we are provided with black-and-white images containing two dots
and dashed lines.
The goal is to determine whether the two dots are connected by a dashed line.
This task can be programmed in just a few lines in Scallop using a
very simple neural architecture for detecting dots and dashes, and outperforms
state-of-the-art transformers.

``` scl
rel result() = endpoint(x), endpoint(y), is_connected(x, y), x != y
```
