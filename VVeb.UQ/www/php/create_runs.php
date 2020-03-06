<?php

// --- Get date
$date_full = getdate();
$date = $date_full[mday]."-".$date_full[month]."-".$date_full[year];
$date = $date."---".$date_full[hours]."-".$date_full[minutes]."-".$date_full[seconds];

// --- Get Image name
$image_name = $_POST["docker_image_run"];
$container_name = $image_name;
$container_name = str_replace('/','_',$container_name);
$container_name = str_replace(':','_',$container_name);
$workdir_name   = 'workdir_'.$date.'_'.$container_name;
$container_name = 'VVebUQ_CONTAINER_'.$date.'_'.$container_name;

// --- Get run-dir
$run_dir = shell_exec('cat config.in');
$run_dir = str_replace("\n", '', $run_dir);

// --- Produce files in run directory of container
$work_dir   = '/VVebUQ_runs';
$base_dir   = $work_dir.'/'.$workdir_name;
$mount_dir  = $run_dir.$workdir_name;
$files_dir  = $base_dir.'/files_for_dakota';
$input_file = $work_dir.'/vvebuq_input.nc';
$args_file  = $files_dir.'/arguments_for_dakota_script.txt';
shell_exec('mkdir -p '.$base_dir);
shell_exec('mkdir -p '.$files_dir);
shell_exec('../interfaces/create_dakota_input_file.perl '.$base_dir.'/dakota_run.in');
shell_exec('cp '.$input_file.' '.$files_dir.'/');
shell_exec('cp ../interfaces/generate_netcdf_based_on_dakota_params.py '.$files_dir.'/');
shell_exec('cp ../interfaces/run_script.perl '.$base_dir.'/');
shell_exec('chmod +x '.$base_dir.'/run_script.perl');
shell_exec('printf \''.$container_name.' '.$mount_dir.' '.$image_name.'\' > '.$args_file);

// --- Run Container
$command = 'docker exec -w '.$base_dir.' -t dakota_container dakota -i ./dakota_run.in -o dakota_run.out';
shell_exec('printf \''.$command.'\n\' &> /VVebUQ_runs/terminal_command.txt');
shell_exec($command.' &> /VVebUQ_runs/terminal_output.txt');
#shell_exec($command);

// --- Go Home! (Said Nigel Fromage)
header("Location: {$_SERVER['HTTP_REFERER']}");
exit;

?>
