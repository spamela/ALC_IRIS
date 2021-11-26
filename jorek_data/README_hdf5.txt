# Download source from wget https://www.hdfgroup.org/downloads/hdf5/source-code/
# NOT FROM GITHUB !!! IMPORTANT FOR FORTRAN LIBS

# You might need to export the environment variables for the compilers
export FC=mpifort
export CC=mpicc
export CXX=mpicxx

cd hdf5
mkdir install
./configure --prefix=/home/pstanis/lib/GNU_7.5/hdf5-1.12.0/install/ --enable-fortran
make -j8
make -j8 install

