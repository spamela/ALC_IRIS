# container to run jorek alone

This image contains a few scripts.
- The waiting_for_actions.sh script will be launched inside the container.
  It just runs a sleeping loop to keep the container alive for actions to be executed from outside
- The job.launch is a script that will be used to run an executable
  It takes 3 arguments as input: executable, input-file and output-file

To build and run this image, you can use the following commands:
docker build -t jorek_alone .
docker container run --name jorek_alone -d jorek_alone
docker exec -it jorek_alone mkdir /jorek_working_dir/run
docker cp your-input-file <container-id>:/jorek_working_dir/run/
docker exec -w /jorek_working_dir/run -it jorek_alone ../job.launch ../jorek/jorek_model303 ./your-input-file jorek_output.txt



