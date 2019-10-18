#!/usr/bin/perl
use strict;
use warnings;


# --- Location
my $workdir     = `pwd`;
chomp($workdir);
my $dakota_tmp  = `ls ./ | grep workdir_jorek`;
my @dakota_dirs = split("\n",$dakota_tmp);

foreach my $dir (@dakota_dirs)
{
  print " >>> Preparing directory $dir...\n";

  `cp -r dakota_optimise/* $dir/`;
  `cp $dir/injt60sa.in $dir/files_for_dakota/injt60sa.template`;
  system("docker run -v $workdir/$dir:/jorek_working_dir/run_dakota_optimise/ -d my_tag2");
}


