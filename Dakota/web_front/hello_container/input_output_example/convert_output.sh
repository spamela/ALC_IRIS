#!/bin/bash

# --- This is an example bash script that extract output from output_file.template to generate an output_values.csv file

# --- Check input arguments (need 2 names...)
if [ "$#" -ne "2" ]
then
  echo "usage: "
  echo "./convert_output.sh output_file.template output_values.csv"
  exit 1
fi

# --- First we extract the second variable in the line of "out:"
out_tmp=`cat $1 | grep "out:"`
my_var=()
IFS=' '
read -ra ADDR <<< "$out_tmp"
for i in "${ADDR[@]}"
do
  my_var+=($i)
done
val1=${my_var[2]}

# --- Then we extract the first value from the xml table
out_tmp=`cat $1 | grep "<xml>"`
my_var=()
IFS='\>'
read -ra ADDR <<< "$out_tmp"
for i in "${ADDR[@]}"
do
  my_var+=($i)
done
out_tmp=${my_var[1]}
my_var=()
IFS='\<'
read -ra ADDR <<< "$out_tmp"
for i in "${ADDR[@]}"
do
  my_var+=($i)
done
val2=${my_var[0]}

# --- Then we extract the var2 in the json table
out_tmp=`cat $1 | grep "var2" | grep -v "we will change"`
my_var=()
IFS='\"'
read -ra ADDR <<< "$out_tmp"
for i in "${ADDR[@]}"
do
  my_var+=($i)
done
val3=${my_var[3]}

# --- Finally, we want to record the values "val1*val2" and "val3"
val_new=`perl -le "print $val1 * $val2"`
printf "output_1,output_2\n" > out.tmp
printf "%15.9e,%15.9e\n" $val_new $val3 >> out.tmp
mv out.tmp output_values.csv
exit 0



