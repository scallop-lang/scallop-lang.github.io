# Paper on Relational Programming with Foundation Models at AAAI'24

<a href="#" class="markdown-tag">Feb 23, 2024</a>

<center>
  <a class="link-button" target="_blank" href="/papers/aaai24.pdf">Check out our AAAI'24 paper!</a>
  <a class="link-button" target="_blank" href="https://scallop.build/">Try out our Live Demo!</a>
</center>

Our paper [Relational Programming with Foundation Models](/papers/aaai24.pdf) will appear at AAAI'24 in Vancouver!
In this work, we have extended Scallop with fundamental capabilities to connect neuro-symbolic programming with **Foundation Models** through a novel **Foreign Interface**.
Now, you can utilize Scallop like never before: invoking an external language model or a vision-language model seamlessly using relations!

![cat-or-dog](/img/aaai24/cat-or-dog.png)

![mountain-height](/img/aaai24/mountain-height.png)

We are presenting our poster during the poster session on *Saturday*.
Please stop by!

## Abstract

Foundation models have vast potential to enable diverse AI applications.
The powerful yet incomplete nature of these models has spurred a wide range of mechanisms to augment them with capabilities such as in-context learning, information retrieval, and code interpreting.
We propose Vieira, a declarative framework that unifies these mechanisms in a general solution for programming with foundation models.
Vieira follows a probabilistic relational paradigm and treats foundation models as stateless functions with relational inputs and outputs.
It supports neuro-symbolic applications by enabling the seamless combination of such models with logic programs, as well as complex, multi-modal applications by streamlining the composition of diverse sub-models.
We implement Vieira by extending the Scallop compiler with a foreign interface that supports foundation models as plugins.
We implement plugins for 12 foundation models including GPT, CLIP, and SAM.
We evaluate Vieira on 9 challenging tasks that span language, vision, and structured and vector databases.
Our evaluation shows that programs in Vieira are concise, can incorporate modern foundation models, and have comparable or better accuracy than competitive baselines.

## Experiments

We have conducted extensive experiments, applying Vieira to diverse set of applications including natural language reasoning, visual reasoning, retrieval-augmented question answering, and even image editing.
Please see below for the selected set of tasks.

![tasks](/img/aaai24/tasks.png)

## Conclusion and Future Directions

Vieira brings together foundation models from diverse domains, providing a unified interface for composition and the ability to perform probabilistic logical reasoning.
This results in solutions with comparable and often superior performance than neural-based baselines.
In the future, we aim to extend the capabilities of Vieira beyond the current in-context learning settings to weakly-supervised training and fine-tuning of foundation models in an end-to-end manner.
