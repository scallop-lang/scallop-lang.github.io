# Lab0 Instructions

We will go through how to setup the environment for the tutorial in this lab.

## Environment Setup

### Option 1: Bash script

This is the recommended way to install Scallop on your computer for **MacOS** and **linux** users.

1. Ensure `wget` is installed on your computer
2. Ensure [`conda`](https://www.anaconda.com) is installed on your computer
3. You can install the required scallop packages by executing the [`install_scallop_env.sh`](/ssft22/labs/install_scallop_env.sh) file. It will install a conda environment, `scallop_env`, where scallopy is installed as a dynamic library in this env.

```
$ chmod u+x ./install_scallop_env.sh
$ . ./install_scallop_env.sh
```

### Option 2: Docker

Alterantively you can setup the environment through the dockerfile.
This method is suitable accross the platforms, including **Windows**, **Linux**, and **MacOS**.

1. Download and install [Docker](https://www.docker.com)
2. Install [VSCode](https://code.visualstudio.com)
3. Install VSCode extension: Docker
4. Install VSCode extension: Remote-Containers
5. Create a new directory, like `scallop-lab-ssft22`
6. Download this [Dockerfile](/ssft22/labs/Dockerfile) and paste it into the directory
7. Open VSCode in this directory
8. `cmd` + `shift` + `p` open the VScode Command Palette
9. Select `Remote containers: Rebuild and Reopen in Container`
10. It will take about 10 to 20 minutes to finish the building process

### Option 3: Install Manually

To install Scallop manually, please visit [download page](/download.html).
We will require you to have at least `scli` (a command line executable) and `scallopy` (a Python library)
available on your computer.

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
