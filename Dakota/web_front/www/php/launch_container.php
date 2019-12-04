<?php


// --- Get Form Variables
$username = $_POST["username"];
$repository = $_POST["repository"];
$tag = $_POST["tag"];
$image_name = $username."/".$repository.":".$tag;
$container_name = "DAKOTA_CODE_CONTAINER___".$username."___".$repository."___".$tag;

// --- Get Form Variables
$run_dir = shell_exec('cat config.in');
$run_dir = str_replace("\n", '', $run_dir);

// --- Some printouts while it launches
echo "<div style=\"background:white;\"><br />";
echo "Running container from Docker image: ".$container_name;
echo "</div>";

// --- Run Container
$docker_out = shell_exec('docker exec -t dakota_container docker container run --name '.$container_name.' -v '.$run_dir.':/working_dir/ -d '.$image_name);

// --- Go Home! (Said Nigel Fromage)
header("Location: {$_SERVER['HTTP_REFERER']}");
exit;

?>
