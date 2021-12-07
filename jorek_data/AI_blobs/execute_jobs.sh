
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

# --- Run memory diagnostic
./check_mem_usage_new.sh > check_mem.txt &

# --- Run JOREK
export OMP_NUM_THREADS=$n_cpu
#mpirun -n 1 --allow-run-as-root ./jorek_model002 < ./inblob_low_visco > ./jorek_output_run.txt
/usr/lib64/openmpi/bin/mpirun -np 1 ./jorek_model002 < ./inblob_low_visco > ./jorek_output_run.txt

# --- Get number of files produced
sentence=`ls ./jorek0*.h5`
count=0
for word in $sentence
do
  count=$((count + 1))
done
# --- This will have counted jorek00000.h5 as well
count=$((count - 1))
# --- Assuming we only saved every 10 files in the JOREK run!
n_files=$(( count * 10 ))

# --- Run data-extractor
mpirun -np $n_cpu --allow-run-as-root ./fortran_process -jorek_path ./ -jorek_file_min 0 -jorek_file_max $n_files -jorek_file_step 10 -variable rho -variable Phi -variable w -resolution 0.01 -limit_buffer -0.0000001 > ./jorek_output_data.txt


exit 0



