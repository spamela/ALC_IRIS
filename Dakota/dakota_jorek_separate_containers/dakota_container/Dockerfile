# --- Docker file for a JOREK installation on SL-7
FROM sl:7
ENV container docker
MAINTAINER Stan Pamela <stanislas.pamela@ukaea.uk>

# --- Packages and environment
RUN yum update -y
#RUN yum install -y epel-release
RUN yum install -y gcc-c++ gcc-gfortran gdb make lapack-devel blas-devel openmpi-devel zlib-devel wget perl perl-Data-Dumper libicu-devel hdf5-openmpi-devel compat-openmpi16
ENV PATH="/usr/lib64/openmpi/bin:${PATH}"
ENV LD_LIBRARY_PATH="/usr/lib64/compat-openmpi16/lib/:${LD_LIBRARY_PATH}"
ENV HOME="/dakota_dir"

# --- Install Dakota
WORKDIR /dakota_dir/
RUN wget --no-check-certificate --no-cache --no-cookies https://dakota.sandia.gov/sites/default/files/distributions/public/dakota-6.10-release-public-rhel7.x86_64.tar.gz
RUN tar -xvf dakota-6.10-release-public-rhel7.x86_64.tar.gz
RUN mv dakota-6.10.0.Linux.x86_64 dakota
ENV INSTALL_DIR="/dakota_dir/dakota"
ENV PATH="${INSTALL_DIR}/bin:${INSTALL_DIR}/share/dakota/test:${INSTALL_DIR}/gui:${PATH}"
ENV PYTHONPATH="${PYTHONPATH}:${INSTALL_DIR}/share/dakota/Python"
ENV LD_LIBRARY_PATH="/usr/lib64/openmpi/lib/:${LD_LIBRARY_PATH}"

# --- Run waiting script
ADD waiting_for_actions.sh /dakota_dir/
WORKDIR /dakota_dir/
RUN chmod +x waiting_for_actions.sh
ENTRYPOINT ["/bin/bash","-c","./waiting_for_actions.sh"]


