<?php


// --- Get Form Variables
$image_name = $_POST["docker_image"];

// --- Some printouts while it launches
echo "<div style=\"background:white;\"><br />";
echo "Pulling Docker image: ".$image_name;
echo "</div>";

// --- Run Container
#$docker_out = shell_exec('docker pull '.$image_name.' > /dev/null && echo "success" || echo "failed"');
$docker_out = shell_exec('docker pull '.$image_name.' > /dakota_runs/terminal_output.txt');

// --- Some printouts while it launches NEED TO RETRIEVE THIS WITH AJAX LISTENER!!!
#echo "<div style=\"background:white;\"><br />";
#echo "Result: ".$docker_out;
#echo "</div>";

// --- Go Home! (Said Nigel Fromage)
header("Location: {$_SERVER['HTTP_REFERER']}");
exit;

?>
