#!/usr/bin/perl

use strict;
use warnings;

# --- Arguments
my $n_arg = $#ARGV + 1;
my @my_args = ();
foreach my $a(@ARGV)
{
  push @my_args, $a;
}

my $jorek_dir = "/marconi_work/FUA33_ELM-UK/spamela/VECMA/jorek_test/jorek";
my $jorek_exe = "jorek_model303";

my $jorek_bin = $jorek_dir."/".$jorek_exe;
my $jorek_inp = $my_args[0];

my $command = $jorek_bin." < ".$jorek_inp." > jorek_output.txt 2>&1";
my $jorek_out = `$command`;
$jorek_out = `cat jorek_output.txt`;
my @split_output = split("current          :",$jorek_out);
my $split_output = $split_output[1];
@split_output = split("icurrent  (in/out)        :",$split_output);
$split_output = $split_output[0];
my @get_current = split("beta_p           :",$split_output);
my $get_current = $get_current[0];
@get_current = split("MA",$get_current);
$get_current = $get_current[0];
$get_current =~ s/^\s+|\s+$//g;

my @get_volume = split("Volume           :", $split_output);
my $get_volume = $get_volume[1];
@get_volume = split(/\s+/, $get_volume);
$get_volume = $get_volume[1];

my $filename = 'output.csv';
open(my $fh, '>', $filename) or die "Could not open file '$filename' $!";
print $fh "Volume,Current\n$get_volume,$get_current\n";
close $fh;

