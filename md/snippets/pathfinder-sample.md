## Pathfinder, Long Range Connectivity Reasoning

In this task we are provided with black-and-white images containing two dots
and dashed lines.
There will be potentially one dashed line connecting the two dots and the goal
is to find out whether they are connected.
With Scallop, this task is represented in just a few lines of Scallop code with
very simple neural architecture, and can achieve state-of-the-art performance
over this task.

``` scl
rel result() = endpoint(x), endpoint(y), is_connected(x, y), x != y
```
