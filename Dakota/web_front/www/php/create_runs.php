<?php


// --- Get Image name
#$image_name = $_POST["docker_image_run"];
$image_name = "spamela2/example_workflow:latest";
$container_name = $image_name;
$container_name = str_replace('/','_',$container_name);
$container_name = str_replace(':','_',$container_name);
$container_name = "VVebUQ___".$container_name;

// --- Get run-dir
$run_dir = shell_exec('cat config.in');
$run_dir = str_replace("\n", '', $run_dir);

// --- Get the number of inputs/outputs
#$n_inputs = $_POST["n_inputs"];
$n_inputs  = 3;
$n_outputs = 2;

// --- Get input bounds and partitions
$n_parts   = array();
$bound_min = array();
$bound_max = array();
for ($i=0; $i<$n_inputs-1; $i++)
{
  #array_push($n_parts,$_POST["n_parts"][$i]);
  array_push($n_parts,2);
  array_push($bound_min,3.0);
  array_push($bound_max,9.0);
}
array_push($n_parts,2);
array_push($bound_min,0.0);
array_push($bound_max,1.0);

// --- Get input profile filename
$input_profile_filename = '/dakota_runs/input_profile.csv';

// --- Write Dakota input file
$dakota_file = '';
$dakota_file = $dakota_file.'environment\n';
$dakota_file = $dakota_file.'  tabular_data\n';
$dakota_file = $dakota_file.'    tabular_data_file = "dakota_run.dat"\n';
$dakota_file = $dakota_file.'method\n';
$dakota_file = $dakota_file.'  multidim_parameter_study\n';
$dakota_file = $dakota_file.'    partitions = '; for ($i=0; $i<$n_inputs; $i++) {$dakota_file = $dakota_file.$n_parts[$i].' ';} $dakota_file = $dakota_file.'\n';
$dakota_file = $dakota_file.'model\n';
$dakota_file = $dakota_file.'  single\n';
$dakota_file = $dakota_file.'variables\n';
$dakota_file = $dakota_file.'  continuous_design = '.$n_inputs.'\n';
$dakota_file = $dakota_file.'    descriptors       '; for ($i=1; $i<=$n_inputs; $i++) {$dakota_file = $dakota_file.'"x'.$i.'" ';} $dakota_file = $dakota_file.'\n';
$dakota_file = $dakota_file.'    lower_bounds      '; for ($i=0; $i< $n_inputs; $i++) {$dakota_file = $dakota_file.$bound_min[$i].' ';} $dakota_file = $dakota_file.'\n';
$dakota_file = $dakota_file.'    upper_bounds      '; for ($i=0; $i< $n_inputs; $i++) {$dakota_file = $dakota_file.$bound_max[$i].' ';} $dakota_file = $dakota_file.'\n';
$dakota_file = $dakota_file.'interface,\n';
$dakota_file = $dakota_file.'        fork\n';
$dakota_file = $dakota_file.'          analysis_driver = "simulator_script.perl"\n';
$dakota_file = $dakota_file.'          parameters_file = "dakota_params.in"\n';
$dakota_file = $dakota_file.'          results_file    = "dakota_params.out"\n';
$dakota_file = $dakota_file.'          work_directory named="workdir_VVebUQ" directory_tag directory_save file_save\n';
$dakota_file = $dakota_file.'          copy_files = "files_for_dakota/*"\n';
$dakota_file = $dakota_file.'        asynchronous\n';
$dakota_file = $dakota_file.'          evaluation_concurrency = 16\n';
$dakota_file = $dakota_file.'responses\n';
$dakota_file = $dakota_file.'  response_functions = '.$n_outputs.'\n';
$dakota_file = $dakota_file.'  no_gradients\n';
$dakota_file = $dakota_file.'  no_hessians\n';

// --- Write simulator script for dakota
$script = '';
$script = $script.'#!/usr/bin/perl\n';
$script = $script.'use strict;\n';
$script = $script.'use warnings;\n';
$script = $script.'# --- Arguments (should be 2: input and ouput file names)\n';
$script = $script.'my @my_args = ();\n';
$script = $script.'foreach my $a(@ARGV) {push @my_args, $a;}\n';
$script = $script.'my @split_tmp = ();\n';
$script = $script.'my $command = "";\n';
$script = $script.'my $output = "";\n';
$script = $script.'my $file = "";\n';
$script = $script.'# --- Location (needed for the container dir-mount)\n';
$script = $script.'my $pwd = `pwd`;\n';
$script = $script.'$pwd =~ s/\s+//g;\n';
$script = $script.'@split_tmp = split("/",$pwd);\n';
$script = $script.'my $dir = $split_tmp[$#split_tmp];\n';
$script = $script.'# --- Preprocessing\n';
$script = $script.'$command = "dprepro ".$my_args[0]." get_dakota_input.template input_values.csv";\n';
$script = $script.'`$command`;\n';
$script = $script.'# --- Get new profile\n';
$script = $script.'$file = `tail -n 1 input_values.csv`;\n';
$script = $script.'@split_tmp = split(",",$file);\n';
$script = $script.'my $val = $split_tmp[2];\n';
$script = $script.'$file = `cat input_profile.csv`;\n';
$script = $script.'my $new_file = "values\\\n";\n';
$script = $script.'@split_tmp = split("\\\n",$file);\n';
$script = $script.'foreach my $line (@split_tmp)\n';
$script = $script.'{\n';
$script = $script.'  if ($line eq "values,errors") {next;}\n';
$script = $script.'  my @values = split(",",$line);\n';
$script = $script.'  my $new_val = $values[0] - 0.5*$values[1] + $val*$values[1];\n';
$script = $script.'  $new_file = $new_file.$new_val."\\\n";\n';
$script = $script.'}\n';
$script = $script.'my $filename = "input_profile.csv";\n';
$script = $script.'open(my $fh, ">", $filename) or die "Could not open file ".$filename." $!";\n';
$script = $script.'print $fh $new_file;\n';
$script = $script.'close $fh;\n';
$script = $script.'# --- Run container for each dir\n';
$script = $script.'$command = "docker container run --name '.$container_name.'_".$dir." -v '.$run_dir.'".$dir.":/working_dir/ -d '.$image_name.'";\n';
$script = $script.'`$command`;\n';
$script = $script.'# --- Postprocessing\n';
$script = $script.'#$output = `tail -n 1 ./output_values.csv`;\n';
$script = $script.'$output = "0.0,0.0"; # Fake output! The real one will be retrieved once the container finishes!\n';
$script = $script.'@split_tmp = split(",",$output);\n';
$script = $script.'foreach my $out (@split_tmp)\n';
$script = $script.'{\n';
$script = $script.'  $output = sprintf("%21s%17.15e f", "", $out);\n';
$script = $script.'  $command = "echo \"".$output."\" >> ".$my_args[1];\n';
$script = $script.'  `$command`;\n';
$script = $script.'}\n';

// --- Write template file to get Dakota values
$template = 'input_1';
for ($i=2; $i<=$n_inputs; $i++)
{
  $template = $template.',input_'.$i;
}
$template = $template.'\n';
$template = $template.'{x1}';
for ($i=2; $i<=$n_inputs; $i++)
{
  $template = $template.',{x'.$i.'}';
}
$template = $template.'\n';


// --- Produce files in run directory of container
$base_dir = '/dakota_runs';
#$base_dir = '.';
shell_exec('mkdir -p '.$base_dir.'/files_for_dakota');
shell_exec('printf \''.$dakota_file.'\' > '.$base_dir.'/dakota_run.in');
shell_exec('printf \''.$script.'\' > '.$base_dir.'/simulator_script.perl');
shell_exec('printf \''.$template.'\' > '.$base_dir.'/files_for_dakota/get_dakota_input.template');
shell_exec('chmod +x '.$base_dir.'/simulator_script.perl');
shell_exec('cp '.$input_profile_filename.' '.$base_dir.'/files_for_dakota/');

// --- Some printouts while it launches
echo "<div style=\"background:white;\"><br />";
echo "Running container from Docker image: ".$container_name;
echo "</div>";

// --- Run Container
$command = 'docker exec -w /dakota_runs -t dakota_container dakota -i ./dakota_run.in -o dakota_run.out';
$docker_out = shell_exec($command);
#shell_exec('echo '.$command.' > /dakota_runs/tmp.txt');
#shell_exec('echo '.$docker_out.' >> /dakota_runs/tmp.txt');

// --- Go Home! (Said Nigel Fromage)
header("Location: {$_SERVER['HTTP_REFERER']}");
exit;

?>
