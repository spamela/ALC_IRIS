# --- Docker file for a waiting SL-7 container
FROM sl:7
ENV container docker
MAINTAINER Stan Pamela <stanislas.pamela@ukaea.uk>

# --- Packages and environment
RUN yum update -y && yum install -y perl
ENV HOME="/working_dir"

# --- Run waiting script
COPY ./ /data_dir/
WORKDIR /working_dir/
CMD ["/bin/bash","-c","cp ../data_dir/*.sh . ; cp ../data_dir/input_file.template . ; ./everything_together.sh"]



