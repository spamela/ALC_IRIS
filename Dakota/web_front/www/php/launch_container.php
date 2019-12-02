<?php


// --- Get Form Variables
$username = $_POST["username"];
$repository = $_POST["repository"];
$tag = $_POST["tag"];
$image_name = $username."/".$repository.":".$tag;
$container_name = "DAKOTA_CODE_CONTAINER___".$username."___".$repository."___".$tag;

// --- Some printouts while it launches
echo "<div style=\"background:white;\"><br />";
echo "Running container from Docker image: ".$image_name;
echo "</div>";

// --- Run Container
$docker_out = shell_exec('docker container run --name '.$container_name.' -d '.$image_name);

// --- Go Home! (Said Nigel Fromage)
header("Location: {$_SERVER['HTTP_REFERER']}");
exit;

?>
