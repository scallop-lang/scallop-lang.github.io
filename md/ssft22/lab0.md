# Lab 0 Instructions

This lab walks you through the setup of the environment for using Scallop on your machine.

## Environment Setup

### Option 1: Bash script

This is the recommended way to install Scallop on your computer for **MacOS** and **linux** users.

1. Ensure `wget` is installed on your computer
2. Ensure [`conda`](https://www.anaconda.com) is installed on your computer
3. You can install the required scallop packages by executing the [`install_scallop_env.sh`](/ssft22/labs/install_scallop_env.sh) file. It will install a conda environment, `scallop-env`, where scallopy is installed as a dynamic library in this env.
4. (Optional) If you are not using `bash`, you will need to manually add the `<SCALLOP_DIR_PATH>/bin` to your environment variable.

```
$ chmod u+x ./install_scallop_env.sh
$ . ./install_scallop_env.sh
```

For a better experience, such as syntax highlighting, we recommend using [Visual Studio Code](https://code.visualstudio.com/download) with
the following extensions:
1. [Scallop Language Syntax Highlight](https://marketplace.visualstudio.com/items?itemName=scallop-lang.scallop)
2. [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
3. [Jupyter](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)

### Option 2: Docker

Alterantively, you can install Scallop using Docker.
This method is suitable across all platforms, including **Windows**, **Linux**, and **MacOS**.

1. Download and install [Docker](https://www.docker.com)
2. Install [VSCode](https://code.visualstudio.com)
3. Install VSCode extension: Docker
4. Install VSCode extension: Remote-Containers
5. Create a new directory, like `scallop-lab-ssft22`
6. Download this [Dockerfile](/ssft22/labs/Dockerfile) and the [devcontainer.json](/ssft22/labs/devcontainer.json) and paste it into the directory
7. Open VSCode in this directory
8. `cmd` + `shift` + `p` open the VScode Command Palette
9. Select `Remote containers: Rebuild and Reopen in Container`
10. It will take about 10 to 20 minutes to finish the building process

### Option 3: Install Manually

To install Scallop manually, visit [download page](/download.html).
Upon successful installation, you should have at least `scli` (a command line executable) and `scallopy` (a Python library)
available on your machine.

## Hello World in Scallop

We have provided two executables in the environment, `scli` and `sclrepl`.
The `scli` executable is a Scallop interpreter,
and `sclrepl` is an interactive command line executable that can interpret your input as you type.

To run your first Scallop program in the environment,
download the following sample file [hello.scl](/examples/hello.scl),
and execute it with `scli`.

```
$ scli hello.scl
```

The `hello.scl` file has the following content:

``` scl
rel hello = {("Hello World")}
```

which basically defines an arity-1 relation called `hello` with only one tuple inside of it: `("Hello World")`.

You should see the output:

```
hello: {("Hello World")}
```

You are now ready to proceed to learn about neurosymbolic programming in Scallop!

