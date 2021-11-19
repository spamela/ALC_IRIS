#!/bin/bash

# --- Modify input file, assuming that we get data from input_scan.csv
# --- We assume there are 4 values:
# 1: R-position of blob
# 2: Z-position of blob
# 3: width of blob
# 4: density amplitude of blob

R_jropes=`head -n 1 input_scan.csv | tail -n 1`
Z_jropes=`head -n 2 input_scan.csv | tail -n 1`
w_jropes=`head -n 3 input_scan.csv | tail -n 1`
rho_jropes=`head -n 4 input_scan.csv | tail -n 1`

eval "sed 's/R_jropes(1)/R_jropes(1)   =  $R_jropes ! /g'    inblob_low_visco > tmp.txt && mv tmp.txt inblob_low_visco"
eval "sed 's/Z_jropes(1)/Z_jropes(1)   =  $Z_jropes ! /g'    inblob_low_visco > tmp.txt && mv tmp.txt inblob_low_visco"
eval "sed 's/w_jropes(1)/w_jropes(1)   =  $w_jropes ! /g'    inblob_low_visco > tmp.txt && mv tmp.txt inblob_low_visco"
eval "sed 's/rho_jropes(1)/rho_jropes(1) = $rho_jropes ! /g' inblob_low_visco > tmp.txt && mv tmp.txt inblob_low_visco"
                                                                                            
exit 0



