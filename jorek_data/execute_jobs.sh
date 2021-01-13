
# --- Get number of available CPUs on this machine
lscpu | grep 'CPU(s):' | grep -v 'NUMA' > ncpu.tmp
sentence=`cat ncpu.tmp`
count=0
for word in $sentence
do
  count=$((count + 1))
  if [ "$count" -eq "2" ] 
  then
    n_cpu=$word
  fi
done

# --- Run JOREK and data-extractor
export OMP_NUM_THREADS=$n_cpu
mpirun -np 1 --allow-run-as-root ./jorek_model500 < ./inmast_grid > ./jorek_output_grid.txt
mpirun -np 1 --allow-run-as-root ./jorek_model500 < ./inmast > ./jorek_output_equi.txt
mpirun -np $n_cpu --allow-run-as-root ./fortran_process -jorek_file jorek00001.h5 -save_pixels -resolution 0.12 -3D_grid > ./jorek_output_data_grid.txt
mpirun -np $n_cpu --allow-run-as-root ./fortran_process -jorek_file jorek00001.h5 -use_pixel_file -variable D_alpha -variable BR -variable BZ -variable Bp -variable rho -variable rho_n -variable T -bin_data -3D_grid > ./jorek_output_data.txt


exit 0



