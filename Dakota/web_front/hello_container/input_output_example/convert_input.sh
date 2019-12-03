#!/bin/bash

# --- This is an example bash script that uses a .csv file to change a given code input file

# --- Check input arguments (need 3 names...)
if [ "$#" -ne "3" ]
then
  echo "usage: "
  echo "./convert_input.sh input_file.template input_values.csv input_file.new"
  exit 1
fi

# --- In our case, we know the csv file only has one line with 3 values, get them...
my_var=()
csv_values=`tail -n 1 $2`
IFS=','
read -ra ADDR <<< "$csv_values"
for i in "${ADDR[@]}"
do
  my_var+=($i)
done

# --- Now just use sed to replace the values in our input file
cp $1 tmp.input
sed "s/<xml>0.9876<\/xml>/<xml>${my_var[0]}<\/xml>/g" tmp.input > tmp.output
mv tmp.output tmp.input
sed "s/\"var2\": \"2.345\"/\"var2\": \"${my_var[1]}\"/g" tmp.input > tmp.output
mv tmp.output $3
rm tmp.input

