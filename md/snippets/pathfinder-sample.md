## Pathfinder, Long Range Connectivity Reasoning

In this task, we are provided with black-and-white images containing two dots
and dashed lines.
The goal is to determine whether the two dots are connected by a dashed line.
This task can be programmed in just a few lines in Scallop using a
very simple neural architecture for detecting dots and dashes, together with
the logic rules below, and outperforms state-of-the-art transformers.

``` scl
rel path(x, y) = dash(x, y)
rel path(x, y) = path(x, z), dash(z, y)
rel is_connected() = dot(x), dot(y), path(x, y), x != y
```
