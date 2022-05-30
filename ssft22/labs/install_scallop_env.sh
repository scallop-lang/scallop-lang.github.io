#! /bin/bash
ROOT_FOLDER=$PWD
SCALLOP_BIN=$ROOT_FOLDER/bin
SCALLOP_PKG=$ROOT_FOLDER/pkg
SCALLOP_LAB=$ROOT_FOLDER/labs
SCALLOP_LAB1=$ROOT_FOLDER/labs/lab1
SCALLOP_LAB2=$ROOT_FOLDER/labs/lab2

LAB1_URL="https://scallop-lang.github.io/ssft22/labs/graph_algo.scl"
LAB2_URL="https://scallop-lang.github.io/ssft22/labs/lab2.tar"

ARC_NAME=$(uname -m)
mkdir $SCALLOP_BIN
mkdir $SCALLOP_PKG
mkdir $SCALLOP_LAB
mkdir $SCALLOP_LAB1
mkdir $SCALLOP_LAB2

echo $OSTYPE

# Check system version
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if [[ "$ARC_NAME" == "x86_64" ]]; then
        echo "Detecting System version: Linux"
        SCLI_URL="https://scallop-lang.github.io/artifacts/scli/x86_64-linux-unknown/v0.1.1/scli"
        SCLREPL_URL="https://scallop-lang.github.io/artifacts/sclrepl/x86_64-linux-unknown/v0.1.1/sclrepl"
        SCALLOPY_URL="https://scallop-lang.github.io/artifacts/scallopy/scallopy-0.1.1-cp39-cp39-manylinux_2_27_x86_64.whl"
    else
        echo "Sorry, we only support 64 bit linux operating system"
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    if [[ "$ARC_NAME" == "x86_64" ]]; then
        # set the urls for intel chips
        echo "Detecting System version: Mac OS with intel chip"
        SCLI_URL="https://scallop-lang.github.io/artifacts/scli/x86_64-apple-darwin/v0.1.1/scli"
        SCLREPL_URL="https://scallop-lang.github.io/artifacts/sclrepl/x86_64-apple-darwin/v0.1.1/sclrepl"
        SCALLOPY_URL="https://scallop-lang.github.io/artifacts/scallopy/scallopy-0.1.1-cp39-cp39-macosx_11_0_arm64.whl"
    else
        # set the urls for M1 chips
        echo "Detecting System version: Mac OS with M1 chip"
        SCLI_URL="https://scallop-lang.github.io/artifacts/scli/arm64-apple-darwin/v0.1.1/scli"
        SCLREPL_URL="https://scallop-lang.github.io/artifacts/sclrepl/arm64-apple-darwin/v0.1.1/sclrepl"
        SCALLOPY_URL="https://scallop-lang.github.io/artifacts/scallopy/scallopy-0.1.1-cp39-cp39-macosx_10_7_x86_64.whl"
    fi
else
    echo "Sorry, we haven't support your OS yet. Please try install through docker"
    exit 1
fi

# Setup Scallop executable
cd $SCALLOP_BIN
wget $SCLI_URL
wget $SCLREPL_URL
chmod u+x scli
chmod u+x sclrepl

# Install the Scallop executable to bashrc file if Path does not contain scallop bin
if [[ ":$PATH:" != *":$SCALLOP_BIN:"* ]];
then
    echo 'not exist, adding'
    echo 'pathadd() {
        if [ -d "$1" ] && [[ ":$PATH:" != *":$1:"* ]]; then
            PATH="${PATH:+"$PATH:"}$1"
        fi
    }
    pathadd '$SCALLOP_BIN >> ~/.bashrc
    source ~/.bashrc
fi

# Setup Scallopy + Python environment
cd $SCALLOP_PKG
wget $SCALLOPY_URL
SCALLOPY_FILE_NAME="$(basename $SCALLOPY_URL)"
echo SCALLOPY_FILE_NAME

cd $ROOT_FOLDER
conda init bash
. ~/.bashrc
. ~/.bash_profile
conda create --name scallop-env python=3.9 -y
conda activate scallop-env
conda install pytorch torchvision torchaudio cpuonly -c pytorch -y
python -m pip install --upgrade pip
python -m pip install $SCALLOP_PKG'/'$SCALLOPY_FILE_NAME
python -m pip install notebook
python -m pip install ipywidgets
python -m pip install tqdm
python -m pip install matplotlib
python -m pip install sklearn
python -m pip install pandas
python -m pip install seaborn
jupyter nbextension enable --py widgetsnbextension

# Download the required material into the labs folder
cd $SCALLOP_LAB1
wget $LAB1_URL
cd $SCALLOP_LAB2
wget $LAB2_URL
tar -xvf lab2.tar
rm lab2.tar

cd $ROOT_FOLDER
