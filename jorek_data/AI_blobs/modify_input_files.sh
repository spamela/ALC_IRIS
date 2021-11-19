#!/bin/bash

# --- Modify input file, assuming that we get data from input_scan.csv
# --- We assume there are 4 values:
# 1: width of blob
# 2: density amplitude of blob

w_jropes=`head -n 1 input_scan.csv | tail -n 1`
rho_jropes=`head -n 2 input_scan.csv | tail -n 1`

eval "sed 's/w_jropes(1)/w_jropes(1)   =  $w_jropes ! /g'    inblob_low_visco > tmp.txt && mv tmp.txt inblob_low_visco"
eval "sed 's/rho_jropes(1)/rho_jropes(1) = $rho_jropes ! /g' inblob_low_visco > tmp.txt && mv tmp.txt inblob_low_visco"
                                                                                            
exit 0



