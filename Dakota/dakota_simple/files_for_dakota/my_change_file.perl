#!/usr/bin/perl

use strict;
use warnings;

# --- Get arguments
my $n_arg = $#ARGV + 1;

my $count      = 0;
my $filename   = "";
my $old_string = "";
my $new_string = "";
while ($count < $n_arg)
{
  if ( ($ARGV[$count] eq "-h") or ($ARGV[$count] eq "-help") )
  {
    print "Usage:\n";
    print "my_change_file.perl -file [filename] -string [old-string-to-be-replaced] -new [new-replacing-string]\n";
    exit 0;
  }
  if ( ($ARGV[$count] eq "-file") and ($count != $n_arg-1) )
  {
    $filename = $ARGV[$count+1];
  }
  if ( ($ARGV[$count] eq "-string") and ($count != $n_arg-1) )
  {
    $old_string = $ARGV[$count+1];
  }
  if ( ($ARGV[$count] eq "-new") and ($count != $n_arg-1) )
  {
    $new_string = $ARGV[$count+1];
  }
  $count++;
}

if ( ($filename eq "") or ($old_string eq "") or ($new_string eq "") )
{
  print "Usage:\n";
  print "my_change_file.perl -file [filename] -string [old-string-to-be-replaced] -new [new-replacing-string]\n";
  exit 0;
}


# --- Get date
my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
my $date_time = sprintf("%04d-%02d-%02d_%02dh%02dm%02ds", $year+1900, $mon+1, $mday, $hour, $min, $sec);
my $filename_save = $filename."_".$date_time;
print "filename: $filename\n";
print "old string: $old_string\n";
print "new string: $new_string\n";
print "file backup: $filename_save\n";


`cp $filename $filename_save`;
open my $open_file, $filename or die "Could not open $filename: $!";
open(my $write_file, ">", ".my_modify_file.tmp");
while( my $line = <$open_file>)
{   
  my $my_grep = grep /$old_string/, $line;
  if ($my_grep != 0)
  {
    my @split_return = split("\n", $line);
    $line = $split_return[0];
    my @split_around = split($old_string, $line);
    my $before = $split_around[0];
    my $after  = $split_around[1];
    print $write_file $before.$new_string.$after."\n";
  }else
  {
    print $write_file "$line";
  }
}
close $open_file;
close $write_file;
`mv .my_modify_file.tmp $filename`;

