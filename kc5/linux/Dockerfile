FROM rockylinux:8

RUN dnf update -y && \
    dnf install -y gcc-c++ gdb make cmake git && \
    dnf clean all 

WORKDIR /workspace

VOLUME ["/workspace"]

CMD ["/bin/bash"]