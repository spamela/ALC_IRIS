#!/usr/bin/perl
use strict;
use warnings;


# --- Location
my $workdir     = `pwd`;
my $dakota_tmp  = `ls ./ | grep workdir_jorek`;
my @dakota_dirs = split("\n",$dakota_tmp);

foreach my $dir (@dakota_dirs)
{
  print " >>> Preparing directory $dir...\n";
  `cp -r files_for_dakota $dir/`;
  `cp ./* $dir/  2>tmp.txt`;
  `cp $dir/dakota_jorek.optimise $dir/dakota_jorek.in`;
  `cp $dir/injt60sa.in $dir/files_for_dakota/injt60sa.template`;
  #`cd $dir ; sbatch run_job; cd $workdir`;
  `cd $dir ; ~/my_qsub run_job; cd $workdir`;
}


