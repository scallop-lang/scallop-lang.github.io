# Relational Programming with Foundation Models is Appearing at AAAI'24!

<a href="#" class="markdown-tag">Feb 23, 2024</a>

<center>
  <a class="link-button" target="_blank" href="/artifacts/papers/aaai24/scallop_aaai24.pdf">Check out our latest AAAI'24 paper!</a>
  <a class="link-button" target="_blank" href="https://scallop.build/">Try out our Live Demo!</a>
</center>

Our latest paper [Relational Programming with Foundation Models](/artifacts/papers/aaai24/scallop_aaai24.pdf) is appearing at AAAI'24 in Vancouver!
In this paper, we have extended Scallop with fundamental capabilities to be connected with **Foundation Models** through a novel **Foreign Interface**.
Now, you can utilize Scallop like never before: calling an external language model or a vision language model seamlessly using relations!

![cat-or-dog](/img/aaai24/cat-or-dog.png)

![mountain-height](/img/aaai24/mountain-height.png)

We are presenting our poster during the poster session on *Saturday*.
Please stop by and we can't wait to show you what we have!

## Abstract

Foundation models have vast potential to enable diverse AI applications.
The powerful yet incomplete nature of these models has spurred a wide range of mechanisms to augment them with capabilities such as in-context learning, information retrieval, and code interpreting.
We propose VIEIRA, a declarative framework that unifies these mechanisms in a general solution for programming with foundation models.
VIEIRA follows a probabilistic relational paradigm and treats foundation models as stateless functions with relational inputs and outputs.
It supports neuro-symbolic applications by enabling the seamless combination of such models with logic programs, as well as complex, multi-modal applications by streamlining the composition of diverse sub-models.
We implement VIEIRA by extending the Scallop compiler with a foreign interface that supports foundation models as plugins.
We implement plugins for 12 foundation models including GPT, CLIP, and SAM.
We evaluate VIEIRA on 9 challenging tasks that span language, vision, and structured and vector databases.
Our evaluation shows that programs in VIEIRA are concise, can incorporate modern foundation models, and have comparable or better accuracy than competitive baselines.

## Experiments

We have conducted thorough experiments, applying Scallop to diverse set of applications including natural language reasoning, visual reasoning, retrieval-augmented question answering, and even image editing.
Please see below for the selected set of tasks that we have applied Scallop to!

![tasks](/img/aaai24/tasks.png)

## Conclusion and Future Directions

Vieira brings together foundation models from diverse domains, providing a unified interface for composition and the ability to perform probabilistic logical reasoning.
This results in solutions with comparable and often superior performance than neural-based baselines.
In the future, we aim to extend the capabilities of Vieira beyond the current in-context learning settings to weakly-supervised training and fine-tuning of foundation models in an end-to-end manner.
