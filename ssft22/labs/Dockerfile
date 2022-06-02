FROM amd64/ubuntu:18.04
SHELL ["/bin/bash", "-c"]

ARG SCLI_URL="https://scallop-lang.github.io/artifacts/scli/x86_64-linux-unknown/v0.1.3/scli"
ARG SCLREPL_URL="https://scallop-lang.github.io/artifacts/sclrepl/x86_64-linux-unknown/v0.1.3/sclrepl"
ARG SCALLOPY_URL="https://scallop-lang.github.io/artifacts/scallopy/scallopy-0.1.3-cp39-cp39-manylinux_2_27_x86_64.whl"
ARG LAB1_URL="https://scallop-lang.github.io/ssft22/labs/graph_algo.scl"
ARG LAB2_URL="https://scallop-lang.github.io/ssft22/labs/lab2.tar"

# Setup system environment and required packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install wget
RUN adduser scallop_user
USER scallop_user
ENV PATH="/home/scallop_user/.local/bin:${PATH}"
WORKDIR /home/scallop_user

RUN wget https://repo.anaconda.com/archive/Anaconda3-2021.11-Linux-x86_64.sh && \
    chmod u+x Anaconda3-2021.11-Linux-x86_64.sh && \
    bash ./Anaconda3-2021.11-Linux-x86_64.sh -b && \
    rm ./Anaconda3-2021.11-Linux-x86_64.sh
ENV PATH="/home/scallop_user/anaconda3/bin/:${PATH}"

# install scallop
RUN mkdir /home/scallop_user/packages && \
    mkdir /home/scallop_user/packages/scallop && \
    mkdir /home/scallop_user/packages/scallop/bin && \
    mkdir /home/scallop_user/packages/scallop/lib && \
    mkdir /home/scallop_user/labs && \
    mkdir /home/scallop_user/labs/lab1 &&\
    mkdir /home/scallop_user/labs/lab2
WORKDIR /home/scallop_user/packages/scallop/bin

RUN wget ${SCLI_URL} && \
    wget ${SCLREPL_URL} && \
    chmod u+x scli && \
    chmod u+x sclrepl
ENV PATH="/home/scallop_user/packages/scallop/bin:${PATH}"

# Setup conda virtual environment for scallop
WORKDIR /home/scallop_user/packages/scallop/lib
RUN wget ${SCALLOPY_URL}
RUN conda update -n base -c defaults conda
RUN source /home/scallop_user/anaconda3/etc/profile.d/conda.sh && \
    conda init bash && \
    . ~/.bashrc && \
    conda create --name scallop-env python=3.9 -y && \
    conda activate scallop-env && \
    conda install pytorch torchvision torchaudio cpuonly -c pytorch -y && \
    python -m pip install --upgrade pip && \
    python -m pip install `basename ${SCALLOPY_URL}` && \
    python -m pip install notebook && \
    python -m pip install ipywidgets && \
    python -m pip install tqdm && \
    python -m pip install matplotlib && \
    python -m pip install sklearn && \
    python -m pip install pandas && \
    python -m pip install seaborn && \
    jupyter nbextension enable --py widgetsnbextension

WORKDIR /home/scallop_user/labs/lab1
RUN wget $LAB1_URL
WORKDIR /home/scallop_user/labs/lab2
RUN wget $LAB2_URL && \
    tar -xvf lab2.tar && \
    rm lab2.tar
WORKDIR /home/scallop_user/labs
