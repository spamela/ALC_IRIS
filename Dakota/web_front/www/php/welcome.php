<?php


// --- Prepare printout
$pwd = shell_exec("pwd");
#$docker_out = shell_exec("docker ps -a");
#$docker_out = shell_exec('OUTPUT_TMP=`docker ps -a`;echo $OUTPUT_TMP');
#$docker_out = system('sudo docker ps -a',$ret);
$docker_out = shell_exec('docker ps -a');
echo "<div style=\"background:white;\"><br />";
echo "Hello ".$_POST["name"]."!<br/>Your email is: ".$_POST["email"]."<br/>you are in: ".$pwd."<br/>docker: ".$docker_out;
echo "</div>";

//$fp = fopen($pwd.'docker.output', 'w');
//fwrite($fp, 'hello');
//fclose($fp);
//shell_exec("echo hello > docker.output");


?>
