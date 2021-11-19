#!/bin/bash

# --- Create unique directory assuming that we get data from input_scan.csv
# --- We assume there are 2 values:
# 1: width of blob
# 2: density amplitude of blob

w_jropes=`head -n 1 input_scan.csv | tail -n 1`
rho_jropes=`head -n 2 input_scan.csv | tail -n 1`

mkdir -p "/data/prominence/jorek_blob_ml_test/run_"$w_jropes"_"$rho_jropes
echo "/data/prominence/jorek_blob_ml_test/run_"$w_jropes"_"$rho_jropes"/" > run_dir.txt
                                                                                            
exit 0



