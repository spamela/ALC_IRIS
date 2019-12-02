# --- Docker file for a waiting SL-7 container
FROM sl:7
ENV container docker
MAINTAINER Stan Pamela <stanislas.pamela@ukaea.uk>

# --- Packages and environment
RUN yum update -y
ENV HOME="/working_dir"

# --- Run waiting script
ADD waiting_for_actions.sh /working_dir/
WORKDIR /working_dir/
RUN chmod +x waiting_for_actions.sh
ENTRYPOINT ["/bin/bash","-c","./waiting_for_actions.sh"]



