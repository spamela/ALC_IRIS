# --- Docker file for a JOREK installation on SL-7
FROM centos:7
ENV container docker
MAINTAINER Stan Pamela <stanislas.pamela@ukaea.uk>

# --- Packages and environment
RUN yum install -y epel-release
RUN yum update -y \
 && yum install -y gcc-c++ gcc-gfortran gdb make lapack-devel blas-devel openmpi-devel zlib-devel wget perl perl-Data-Dumper libicu-devel hdf5-openmpi-devel compat-openmpi16 \
 && yum install -y netcdf4-python.x86_64 python3 python3-pip.noarch \
 && pip3 install netCDF4

# --- Run waiting script
ADD user_code.py /data_dir/
WORKDIR /work_dir/
CMD python3 user_code.py
CMD ["/bin/bash","-c","cp ../data_dir/* . ; python3 user_code.py"]

