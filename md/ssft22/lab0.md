# Lab0 Instructions

We will go through how to setup the environment for the tutorial in this lab.

## Environment Setup

1. Download and install docker
2. Install VSCode
3. Install VSCode extension: docker
4. Install VSCode extension: Remote-Containers
5. `cmd` + `shift` + `p` open the VScode Command Palette
6. Select `Remote containers: Rebuild and Reopen in Container`
7. It will take about 10 to 20 minutes to finish the building process

## Hello World with Scallop

We have provided two executables in the environment, `scli` and `sclrepl`.
The `scli` executable is the Scallop interpreter,
and the `sclrepl` is an interactive command line executable that can interpret your input as you type.

To run the first program in the environment, you can type the following commands to your terminal:

```
$ cd ~/labs/lab0_hello_world
$ scli hello_world.scl
```

Note that the `hello_world.scl` file has the following content:

```
rel hello = {("Hello World")}
```

which basically defines an arity-1 relation called `hello` with only one tuple inside of it: `("Hello World")`.

You should see the output:

```
hello: {("Hello World")}
```

After this, you are ready to proceed to the next lab to learn more about the Scallop language!
