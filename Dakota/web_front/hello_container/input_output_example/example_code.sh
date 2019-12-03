#!/bin/bash

# --- This is an example bash script that extract output from output_file.template to generate an output_values.csv file

# --- Check input arguments (need 2 names...)
if [ "$#" -ne "2" ]
then
  echo "usage: "
  echo "./example_code.sh input_file.new output_file.template"
  exit 1
fi

# --- First we extract the xml variable
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
val1=${my_var[0]}

# --- Then we extract the var2 in the json table
out_tmp=`cat $1 | grep "var2" | grep -v "we will change"`
my_var=()
IFS='\"'
read -ra ADDR <<< "$out_tmp"
for i in "${ADDR[@]}"
do
  my_var+=($i)
done
val2=${my_var[3]}

# --- Then we do some cutting-edge calculations using val1 and val2
val1_new=`perl -le "print $val1 * $val2"`
val2_new=`perl -le "print $val1 - $val2"`
val3_new=`perl -le "print $val1 + $val2"`


# --- And we write the output file
printf "// this is just a random output file\n" > $2
printf "// to demonstrate what is expected for the I/O script\n" >> $2
printf "\n" >> $2
printf "\n" >> $2
printf "// some data\n" >> $2
printf "out: 1.2345 %15.9e 11.223 44.556\n" $val1_new >> $2
printf "\n" >> $2
printf "...\n" >> $2
printf "more output\n" >> $2
printf "goes here\n" >> $2
printf "...\n" >> $2
printf "\n" >> $2
printf "// some more data\n" >> $2
printf "<output>\n" >> $2
printf "  <xml>%15.9e</xml>\n" $val2_new >> $2
printf "  <xml2>1.2345</xml2>\n" >> $2
printf "  <xml3>2.3456</xml3>\n" >> $2
printf "</output>\n" >> $2
printf "\n" >> $2
printf "...\n" >> $2
printf "more output\n" >> $2
printf "goes here\n" >> $2
printf "...\n" >> $2
printf "\n" >> $2
printf "// and a third output\n" >> $2
printf "{\n" >> $2
printf "  \"a-json-tree\": {\n" >> $2
printf "    \"title\": \"random-data\",\n" >> $2
printf "    \"hello\": \"how are you\",\n" >> $2
printf "    \"data-table\": {\n" >> $2
printf "      \"var1\": \"1.234\",\n" >> $2
printf "      \"var2\": \"%15.9e\",\n" $val3_new >> $2
printf "      \"var3\": \"3.456\",\n" >> $2
printf "    }\n" >> $2
printf "  }\n" >> $2
printf "}\n" >> $2
printf "\n" >> $2




