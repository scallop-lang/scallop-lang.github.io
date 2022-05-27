# Lab0 Instructions

We will go through how to set up the environment for the tutorial in this lab.

## Environment Setup

### Option 1: Bash script
This is the recommended way to install Scallop on your computer for **MacOS** and **Linux** users.

1. Ensure `wget` is installed on your computer
2. Ensure `conda` is installed on your computer
3. You can install the required scallop packages by executing the `install_scallop_env.sh` file. It will install a conda environment, `scallop-env`, where scallopy is installed as a dynamic library in this env. Note that if you are not using bash, you will need to manually add the `<SCALLOP_DIR_PATH>/bin` to your environment variable.
```
chmod u+x ./install_scallop_env.sh
. ./install_scallop_env.sh
```

### Option 2: Docker
Alternatively, you can set up the environment through the docker file. This method is suitable across the platforms, including **Windows**, **Linux**, and **MacOS**.
1. Download and install docker
2. Install VSCode
3. Install VSCode extension: docker
4. Install VSCode extension: Remote-Containers
5. `cmd` + `shift` + `p` open the VScode Command Palette
6. Select `Remote containers: Rebuild and Reopen in Container`
7. It will take about 10 to 20 minutes to finish the building process

## Run hello world
We have provided two executables in the environment, `scli` and `sclrepl`.
The `scli` executable is the Scallop interpreter,
and the `sclrepl` is an interactive command-line executable that can interpret your input as you type.

To run the first program in the environment, you can type the following commands to your terminal:
```
cd ~/labs/lab0_hello_world
scli hello_world.scl
```

You should see the output:
```
hello: {("Hello World")}
```
