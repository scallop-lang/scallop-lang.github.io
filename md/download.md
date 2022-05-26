# Download

We currently offer the download of `scli`, `sclrepl`, and `scallopy`.

# Scallop Interpreter `scli`

Scallop interpreter is a command line executable.
You can simply use `scli <FILE>.scl` to execute a Scallop file.
For other usage, please type `scli --help` for instructions.

| System | Architecture | Version | Download                                                   |
|--------|--------------|---------|------------------------------------------------------------|
| Mac OS | Apple M1     | v0.1.2  | [`scli`](/artifacts/scli/arm64-apple-darwin/v0.1.2/scli)   |
| Mac OS | Intel x86_64 | v0.1.2  | [`scli`](/artifacts/scli/x86_64-apple-darwin/v0.1.2/scli)  |
| Linux  | Intel x86_64 | v0.1.1  | [`scli`](/artifacts/scli/x86_64-linux-unknown/v0.1.1/scli) |

Here is a screenshot of how `scli` is invoked in a terminal.

<div class="center">
  <img src="/img/scli-screenshot.png" width="500px" />
</div>

# Scallop REPL `sclrepl`

Scallop REPL is an interactive command line executable that can
interpret your input as you type.
This program is great for testing quick ideas and doing demo.

| System | Architecture | Version | Download                                                            |
|--------|--------------|---------|---------------------------------------------------------------------|
| Mac OS | Apple M1     | v0.1.2  | [`sclrepl`](/artifacts/sclrepl/arm64-apple-darwin/v0.1.2/sclrepl)   |
| Mac OS | Intel x86_64 | v0.1.2  | [`sclrepl`](/artifacts/sclrepl/x86_64-apple-darwin/v0.1.2/sclrepl)  |
| Linux  | Intel x86_64 | v0.1.1  | [`sclrepl`](/artifacts/sclrepl/x86_64-linux-unknown/v0.1.1/sclrepl) |

Here is a screenshot of `sclrepl` in a terminal.

<div class="center">
  <img src="/img/sclrepl-screenshot.png" width="500px" />
</div>

# Scallop Python Library `scallopy`

`scallopy` is a python library that can be installed via `pip`.
After downloading the `.whl` file, you can install using `pip` in the following way.

``` bash
$ pip install PATH/TO/YOUR/scallopy-[YOUR_VERSION].whl
```

Please be sure to download a relevant `scallopy` version.
You should consider your Python version and your system and architecture version.
We advise you to use [Python Virtual Env](#) or [Anaconda](#) to manage your Python version
so that you can install the following wheels with ease.
For example, you can create a Python 3.9 conda environment and install scallop with the following
commands:

``` bash
$ conda create --name scallop-env python=3.9
$ conda activate scallop-env
$ pip install PATH/TO/YOUR/scallopy-0.1.2-cp39-cp39-[YOUR_VERSION].whl
```

Note that if you want to use `scallopy` inside a Conda environment using an M1 Mac, you should
download the `x86_64` version of `scallopy`.

| System | Architecture | Python Version | Version | Download |
|--------|--------------|----------------|---------|----------|
| Mac OS | Apple M1     | Python 3.9     | v0.1.2  | [`scallopy-0.1.2-cp39-cp39-macosx_11_0_arm64.whl`](/artifacts/scallopy/scallopy-0.1.2-cp39-cp39-macosx_11_0_arm64.whl)   |
| Mac OS | Intel x86_64 | Python 3.9     | v0.1.2  | [`scallopy-0.1.2-cp39-cp39-macosx_10_7_x86_64.whl`](/artifacts/scallopy/scallopy-0.1.2-cp39-cp39-macosx_10_7_x86_64.whl)  |
| Linux  | Intel x86_64 | Python 3.8     | v0.1.1  | [`scallopy-0.1.1-cp38-cp38-manylinux_2_27_x86_64.whl`](/artifacts/scallopy/scallopy-0.1.1-cp38-cp38-manylinux_2_27_x86_64.whl) |
| Linux  | Intel x86_64 | Python 3.9     | v0.1.1  | [`scallopy-0.1.1-cp39-cp39-manylinux_2_27_x86_64.whl`](/artifacts/scallopy/scallopy-0.1.1-cp39-cp39-manylinux_2_27_x86_64.whl) |

Here is a screenshot of how the Scallopy library is imported and executed within a Python REPL.

<div class="center">
  <img src="/img/scallopy-screenshot.png" width="500px" />
</div>

# Scallop Language Syntax Highlight in VSCode

We offer a VSCode plugin for you to write Scallop program in VSCode more comfortably.
You can visit

- [Scallop Language Support in VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=scallop-lang.scallop)

or directly search "Scallop" in VSCode Extensions:

<div class="center">
  <img src="/img/scallop-vscode-marketplace.png" width="300px" />
</div>

# Other Artifacts and Build Request

If you have a machine which you are unable to find a proper Scallop artifact, please
[contact us](/contact.html).
We are still working on open sourcing our Scallop language and framework.
In the mean time, please stay tuned.
