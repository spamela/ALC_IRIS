#!/bin/bash

# --- Modify input file, assuming that we get data from input_scan.csv
# --- We assume there are 5 values:
# 1: position of rho tanh
# 2: position of T tanh
# 3: rhon in core
# 4: rhon in SOL
# 5: position of rhon tanh

rho_tanh=`head -n 1 input_scan.csv | tail -n 1`
T_tanh=`head -n 2 input_scan.csv | tail -n 1`
rhon_core=`head -n 3 input_scan.csv | tail -n 1`
rhon_sol=`head -n 4 input_scan.csv | tail -n 1`
rhon_tanh=`head -n 5 input_scan.csv | tail -n 1`

eval "sed 's/rho_coef(5)/rho_coef(5)   =  $rho_tanh ! /g'  inmast_grid > tmp.txt && mv tmp.txt inmast_grid"
eval "sed 's/T_coef(5)/T_coef(5)     =  $T_tanh ! /g'      inmast_grid > tmp.txt && mv tmp.txt inmast_grid"
eval "sed 's/rhon_0/rhon_0        = $rhon_core ! /g'       inmast_grid > tmp.txt && mv tmp.txt inmast_grid"
eval "sed 's/rhon_1/rhon_1        = $rhon_sol ! /g'        inmast_grid > tmp.txt && mv tmp.txt inmast_grid"
eval "sed 's/rhon_coef(5)/rhon_coef(5)  = $rhon_tanh ! /g' inmast_grid > tmp.txt && mv tmp.txt inmast_grid"
                                                                                            
eval "sed 's/rho_coef(5)/rho_coef(5)   =  $rho_tanh ! /g'  inmast      > tmp.txt && mv tmp.txt inmast"
eval "sed 's/T_coef(5)/T_coef(5)     =  $T_tanh ! /g'      inmast      > tmp.txt && mv tmp.txt inmast"
eval "sed 's/rhon_0/rhon_0        = $rhon_core ! /g'       inmast      > tmp.txt && mv tmp.txt inmast"
eval "sed 's/rhon_1/rhon_1        = $rhon_sol ! /g'        inmast      > tmp.txt && mv tmp.txt inmast"
eval "sed 's/rhon_coef(5)/rhon_coef(5)  = $rhon_tanh ! /g' inmast      > tmp.txt && mv tmp.txt inmast"

exit 0



