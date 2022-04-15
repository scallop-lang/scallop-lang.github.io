## [CLEVR](https://cs.stanford.edu/people/jcjohns/clevr/), Compositional Language and Elementary Visual Reasoning

This task concerns reasoning about simple 3D objects in a given image in order to
answer questions such as "how many objects are colored blue?".
To express this task in Scallop, we use neural components to generate a symbolic
representation of the image, in the form of a *scene graph*, as well as a
*programmatic query* to represent the question.  On the other hand, the reasoning
component specifies various operations such as selecting, comparing, and counting
objects with the specified attributes.
Scallop enables to integrate all of these components in a common framework
and perform training in an end-to-end fashion.

``` scl
// 3 objects in the scene; the first and the third are blue, and the second is red
rel obj = {0, 1, 2}
rel color = {(0, "blue"), (1, "red"), (2, "blue")}

// the programmatic query asks for the number of blue objects occurring in the scene
rel scene_expr = {0}
rel filter_color_expr = {(1, 0, "blue")}
rel count_expr = {(2, 1)}
rel root_expr = {2}
query num_result // query should return `(2)`
```
