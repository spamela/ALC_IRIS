# --- Docker file for a JOREK installation on Ubuntu-18.04
FROM ubuntu:18.04
ENV container docker
MAINTAINER Stan Pamela <stanislas.pamela@ukaea.uk>

# --- Packages and environment
RUN apt-get update -y
RUN apt-get install -y gfortran g++ libopenmpi-dev libhdf5-openmpi-dev libblas-dev liblapack-dev libscalapack-openmpi-dev wget git tar make zip

# --- Set environment variables
ENV HOME="/jorek_working_dir"
ENV LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu/:${LD_LIBRARY_PATH}"
ENV LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu/hdf5/openmpi/:${LD_LIBRARY_PATH}"

# --- Download Scotch and Pastix libraries
WORKDIR /jorek_working_dir/libs/
RUN wget https://github.com/spamela/ALC_IRIS/raw/master/jorek_data/scotch_5.1.tar.bz
RUN wget https://github.com/spamela/ALC_IRIS/raw/master/jorek_data/pastix_5.2.2.22.tar.bz
RUN tar -xvzf scotch_5.1.tar.bz
RUN tar -xvzf pastix_5.2.2.22.tar.bz

# --- Install Scotch
WORKDIR /jorek_working_dir/libs/scotch_5.1/src/
RUN wget https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/Makefile.inc.scotch
RUN mv Makefile.inc.scotch Makefile.inc
RUN make -j
RUN make -j ptscotch

# --- Install Pastix
WORKDIR /jorek_working_dir/libs/pastix_5.2.2.22/src/
RUN wget https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/config.in.pastix
RUN mv config.in.pastix config.in
RUN wget https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/variable_csc.c
RUN mv variable_csc.c sopalin/src/variable_csc.c
RUN make -j
RUN make -j install

# --- Copy JOREK into workdir and go there.
# --- jorek.git is not open-source, so need to copy it directly
# --- ie. you need to have a version of jorek (here called just ./jorek/)
COPY jorek/ /jorek_working_dir/jorek/
# --- Install JOREK
WORKDIR /jorek_working_dir/jorek/
RUN wget https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/Makefile.inc.jorek.ubuntu
RUN mv Makefile.inc.jorek.ubuntu Makefile.inc
RUN sed 's/303/002/g'                              Makefile.inc > tmp.txt            && mv tmp.txt Makefile.inc
RUN sed 's/n_tor /n_tor = 1 !/g'                   models/mod_settings.f90 > tmp.txt && mv tmp.txt models/mod_settings.f90
RUN sed 's/n_plane /n_plane = 1 !/g'               models/mod_settings.f90 > tmp.txt && mv tmp.txt models/mod_settings.f90
RUN sed 's/n_coord_tor /n_coord_tor = 1 !/g'       models/mod_settings.f90 > tmp.txt && mv tmp.txt models/mod_settings.f90
RUN sed 's/n_period /n_period = 1 !/g'             models/mod_settings.f90 > tmp.txt && mv tmp.txt models/mod_settings.f90
RUN sed 's/n_coord_period /n_coord_period = 1 !/g' models/mod_settings.f90 > tmp.txt && mv tmp.txt models/mod_settings.f90
RUN make -j 4
# --- Install JOREK's data-extractor for Mitsuba2 plasma rendering
WORKDIR /jorek_working_dir/jorek/util/data_extractor/
RUN wget https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/Makefile.data_extractor
RUN mv Makefile.data_extractor Makefile
RUN make

# --- Copy input files and job scripts into work-data-dir that will be copied into mounted dir /tmp/work_dir/ at run-time
WORKDIR /work_data_required/
RUN cp /jorek_working_dir/jorek/namelist/model002/inblob_low_visco .
RUN sed 's/tstep /tstep   = 0.005 !/g' inblob_low_visco > tmp.txt && mv tmp.txt inblob_low_visco
RUN wget https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/AI_blobs/execute_jobs.sh
RUN wget https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/AI_blobs/modify_input_files.sh
RUN chmod +x ./execute_jobs.sh ./modify_input_files.sh
# --- Copy fake input file (ONLY WHEN NOT RUNNING THROUGH VVeb.UQ)
#RUN wget https://raw.githubusercontent.com/spamela/ALC_IRIS/master/jorek_data/AI_blobs/input_scan.csv
# --- Copy codes into work-dir
RUN cp /jorek_working_dir/jorek/jorek_model002 .
RUN cp /jorek_working_dir/jorek/util/data_extractor/fortran_process .
# --- Clean-up compile directory to reduce image size
RUN rm -rf /jorek_working_dir/*
# --- Run JOREK and post-processing.
# --- We delete everything, except input files and post-processed files. This will reduce data-retrieval.
WORKDIR /tmp/work_dir/
#CMD ["/bin/bash","-c","cp -r /work_data_required/* . ; ./modify_input_files.sh ; ./execute_jobs.sh ; mv jorek_data_*.ascii.bin inmast* input_scan.csv jorek_output_* ../ ; rm -rf * ; mv ../jorek_data_*.ascii.bin ../inmast* ../input_scan.csv ../jorek_output_* . ; tail -f /dev/null"]
CMD ["/bin/bash","-c","cp -r /work_data_required/* . ; ./modify_input_files.sh ; ./execute_jobs.sh ; mv data_jorek*.h5 inblob_low_visco* input_scan.csv jorek_output_* ../ ; rm -rf * ; mv ../data_jorek*.h5 ../inblob_low_visco* ../input_scan.csv ../jorek_output_* . ; tail -f /dev/null"]

# --- Debug only
#ENTRYPOINT ["/bin/bash","-c","tail -f /dev/null"]
#CMD ["/bin/bash","-c","tail -f /dev/null"]



