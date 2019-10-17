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
  chdir("$workdir");
  `cp -r dakota_optimise/* $dir/`;
  `cp $dir/injt60sa.in $dir/files_for_dakota/injt60sa.template`;
  chdir("$workdir/$dir");
  system("dakota -i dakota_jorek.in -o dakota_jorek.out &");
}

