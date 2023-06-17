<center>
  <div style="height: 20px"></div>
  <h1>Scallop Tutorial @ <a href="https://pldi23.sigplan.org" target="_blank">PLDI'23</a></h1>
  <div style="height: 20px"></div>
  <div>
    Tutorial: Saturday, June 17, 2023 at 9:00-12:30 (EST) in Room <a href="https://pldi23.sigplan.org/room/pldi-2023-venue-magnolia-7-8" target="_blank">Magnolia 7-8</a>
  </div>
  <div>
    Talk: Monday, June 19, 2023 at 16:00-16:20 (EST) in Room <a href="https://pldi23.sigplan.org/room/pldi-2023-venue-royal" target="_blank">Royal</a>
  </div>
  <div>
    [
    <a href="#section-0">Introduction</a>
    |
    <a href="#section-1">Structure of Tutorial</a>
    |
    <a href="#section-2">Getting Started</a>
    |
    <a href="#section-3">Learn More</a>
    ]
  </div>
  <div style="height: 20px"></div>
  <a class="link-button big" href="/pldi23/tutorial.html" target="_blank" style="margin-top: 20px">Step-by-Step Guide</a>
  <div style="height: 50px"></div>
</center>

# Introduction

We introduce Scallop, a new programming language for neurosymbolic programming.
Scallop is a declarative language based on Datalog, and additionally supports modern logic programming features including stratified negation, aggregation, foreign functions, algebraic data types, and etc.
It can be used to create end-to-end neurosymbolic applications, which combine neural components and logical components.
Here, neural components can be used to process unstructured data such as images and texts, while logical components can be used to perform systematic reasoning.

# Structure of Tutorial

This tutorial is going to be divided into two parts:
- Part A: Get familiar with the Scallop programming language by going through examples of discrete logical reasoning.
- Part B: Combine Scallop with neural networks to solve tasks involving both perception and reasoning.

# Getting Started

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

# Learn More

## About the Presenters

- [Ziyang Li](https://liby99.github.io) is a 4th year PhD student at the University of Pennsylvania advised by Professor Mayur Naik. He received her dual major of B.S. Computer Science and B.S. Mathematics from the University of California, San Diego in 2019. His research interests lie in the fields of programming languages, machine learning, and the combination of the two. In particular, he is the main system architect of the Scallop programming language.

- [Jiani Huang](https://www.cis.upenn.edu/~jianih/) is a 5th year PhD student at the University of Pennsylvania advised by Professor Mayur Naik. She received her undergraduate degree from the University of California, San Diego in 2018. Her research interest lies in the intersection of machine learning and programming language, specifically in combining neural and symbolic approaches to develop accurate, reliable, and effient machine-learning solutions. She is the main application developer using the Scallop programming language.

- [Mayur Naik](https://www.cis.upenn.edu/~mhnaik/) is a professor of computer science at the University of Pennsylvania. His research interests span the areas of program analysis, constraint solving, and machine learning for programming. He holds a Ph.D. in Computer Science from Stanford University. Earlier, he was a researcher at Intel Labs and a professor in the College of Computing at Georgia Tech.

## Resources

* [Scallop Documentation](https://scallop-lang.github.io/doc/index.html)
* [Scallop Website](https://scallop-lang.github.io/)
* [Scallop VSCode Plugin](https://marketplace.visualstudio.com/items?itemName=scallop-lang.scallop)

> The recordings will later be posted

## References

- [Our NeurIPS'21 Paper](https://www.cis.upenn.edu/~mhnaik/papers/neurips21.pdf)
- [Our PLDI'23 Paper](https://dl.acm.org/doi/10.1145/3591280)
