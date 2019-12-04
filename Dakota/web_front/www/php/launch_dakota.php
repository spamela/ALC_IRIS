<?php


// --- Get Form Variables
$container_name = "spamela2/dakota_container:latest";
$run_dir = shell_exec('cat config.in');
$run_dir = str_replace("\n", '', $run_dir);

// --- Some printouts while it launches
echo "<div style=\"background:white;\"><br />";
echo "Running container from Docker image: ".$container_name;
echo "</div>";

// --- Run Container
$docker_out = shell_exec('docker container run --privileged --name dakota_container -v /var/run/docker.sock:/var/run/docker.sock -v '.$run_dir.':/dakota_runs/ -id '.$container_name);
#$docker_out = shell_exec('docker run docker/whalesay cowsay boo');

// --- Go Home! (Said Nigel Fromage)
header("Location: {$_SERVER['HTTP_REFERER']}");
exit;

?>
