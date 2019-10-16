# --- Docker file for a JOREK installation on SL-7
FROM sl:7
ENV container docker
MAINTAINER Stan Pamela <stanislas.pamela@ukaea.uk>

# --- Packages and environment
RUN yum update -y
RUN yum install -y epel-release
RUN yum install -y gcc-c++ gcc-gfortran gdb make lapack-devel blas-devel openmpi-devel zlib-devel wget perl perl-Data-Dumper libicu-devel hdf5-openmpi-devel compat-openmpi16
ENV PATH="/usr/lib64/openmpi/bin:${PATH}"
ENV LD_LIBRARY_PATH="/usr/lib64/compat-openmpi16/lib/:${LD_LIBRARY_PATH}"

# --- Copy JOREK into workdir and go there.
# --- jorek.git is not open-source, so need to copy it directly
# --- ie. you need to have a version of jorek (here called just ./jorek/)
COPY jorek/ /jorek_working_dir/jorek/
COPY run_dakota/ /jorek_working_dir/run_dakota/
#COPY run_test/ /jorek_working_dir/run_test/
ENV HOME="/jorek_working_dir"

# --- Download Scotch and Pastix libraries
WORKDIR /jorek_working_dir/libs/
RUN wget --no-check-certificate --no-cache --no-cookies https://github.com/spamela/ALC_IRIS/raw/master/jorek_data/scotch_5.1.tar.bz
RUN wget --no-check-certificate --no-cache --no-cookies https://github.com/spamela/ALC_IRIS/raw/master/jorek_data/pastix_5.2.2.22.tar.bz
RUN tar -xvzf scotch_5.1.tar.bz
RUN tar -xvzf pastix_5.2.2.22.tar.bz

# --- Install Scotch
WORKDIR /jorek_working_dir/libs/scotch_5.1/src/
RUN wget --no-check-certificate --no-cache --no-cookies https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/Makefile.inc.scotch
RUN mv Makefile.inc.scotch Makefile.inc
RUN make -j
RUN make -j ptscotch

# --- Install Pastix
WORKDIR /jorek_working_dir/libs/pastix_5.2.2.22/src/
RUN wget --no-check-certificate --no-cache --no-cookies https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/config.in.pastix
RUN mv config.in.pastix config.in
RUN make -j
RUN make -j install

# --- Install JOREK
WORKDIR /jorek_working_dir/jorek/
RUN wget --no-check-certificate --no-cache --no-cookies https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/Makefile.inc.jorek
RUN wget --no-check-certificate --no-cache --no-cookies https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/jorek2vtk.f90
RUN mv Makefile.inc.jorek Makefile.inc
RUN mv jorek2vtk.f90 diagnostics/
RUN sed 's/n_tor          = 11/n_tor          = 1/g' models/model303/mod_parameters.f90 > tmp.txt
RUN sed 's/n_plane        = 32/n_plane        = 1/g' tmp.txt > models/model303/mod_parameters.f90
RUN rm tmp.txt 
RUN make -j
RUN make -j jorek2vtk

# --- Install Dakota
WORKDIR /jorek_working_dir/
RUN wget --no-check-certificate --no-cache --no-cookies https://dakota.sandia.gov/sites/default/files/distributions/public/dakota-6.10-release-public-rhel7.x86_64.tar.gz
RUN tar -xvf dakota-6.10-release-public-rhel7.x86_64.tar.gz
RUN mv dakota-6.10.0.Linux.x86_64 dakota
ENV INSTALL_DIR="/jorek_working_dir/dakota"
ENV PATH="${INSTALL_DIR}/bin:${INSTALL_DIR}/share/dakota/test:${INSTALL_DIR}/gui:${PATH}"
ENV PYTHONPATH="${PYTHONPATH}:${INSTALL_DIR}/share/dakota/Python"
ENV LD_LIBRARY_PATH="/usr/lib64/openmpi/lib/:${LD_LIBRARY_PATH}"

# --- Run DAKOTA-JOREK JT-60SA example
WORKDIR /jorek_working_dir/run_dakota/
RUN echo "dakota -i dakota_jorek.in -o dakota_jorek.out" > job.launch
RUN chmod +x ./job.launch
ENTRYPOINT ["/bin/bash","-c","./job.launch"]
 
# --- Run JOREK JT-60SA example
#WORKDIR /jorek_working_dir/run_test/
#RUN echo "mpirun -np 1 --allow-run-as-root ../jorek/jorek_model303 < ./injt60sa.in > ./jorek_output.txt 2> tmp.out" >> job.launch
#RUN chmod +x ./job.launch
#ENTRYPOINT ["/bin/bash","-c","./job.launch"]

# --- Run JOREK Tearing mode example
#WORKDIR /jorek_working_dir/run/
#RUN cp ../jorek/jorek_model303 .
#RUN cp ../jorek/namelist/model300/intear .
#RUN echo "mpirun -np 1 --allow-run-as-root ./jorek_model303 < ./intear > ./jorek_output.txt 2> tmp.out" > job.launch
#RUN chmod +x ./job.launch
#ENTRYPOINT ["/bin/bash","-c","./job.launch"]


