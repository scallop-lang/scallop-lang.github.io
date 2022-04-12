## CLEVR, Compositional Language and Elementary Visual Reasoning

In [this task](https://cs.stanford.edu/people/jcjohns/clevr/), we seek to reason
about images containing objects on the scene, in order to answer questions like
"How many blue objects are there in the scene".
Neural components are responsible for generating correct symbolic representation
of the image, a.k.a. *scene graphs*, and also a *programmatic query* representing
the question.
With Scallop, all of them can be integrated in a same framework and training can
be performed in an end-to-end fashion.

``` scl
// 3 Objects in the scene; the first and the third are blue, and the second is red
rel obj = {0, 1, 2}
rel color = {(0, "blue"), (1, "red"), (2, "blue")}

// The programmatic query asks about how many blue objects are there in the scene
rel scene_expr = {0}
rel filter_color_expr = {(1, 0, "blue")}
rel count_expr = {(2, 1)}
rel root_expr = {2}
query num_result // Query should return `(2)`
```
