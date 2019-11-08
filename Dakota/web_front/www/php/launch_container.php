<?php


// --- Get Form Variables
$username = $_POST["username"];
$repository = $_POST["repository"];
$tag = $_POST["tag"];
$container_name = $username."/".$repository.":".$tag;

// --- Some printouts while it launches
echo "<div style=\"background:white;\"><br />";
echo "Running container from Docker image: ".$container_name;
echo "</div>";

// --- Run Container
$docker_out = shell_exec('docker container run --name dakota_jorek -d '.$container_name);
#$docker_out = shell_exec('docker run docker/whalesay cowsay boo');

// --- Go Home! Said Nigel Fuckage
header("Location: {$_SERVER['HTTP_REFERER']}");
exit;

?>
