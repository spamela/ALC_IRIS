#!/bin/bash

# --- Check test-program is here!
if [ ! -f "example_boost_interprocess.cpp" ] ; then
  echo "You need the test-program example_boost_interprocess.cpp"
  echo "Aborting..."
  exit 1
fi

# --- Download Boost library
if [ ! -d "boost" ] ; then
  wget https://sourceforge.net/projects/boost/files/boost/1.62.0/boost_1_62_0.tar.gz
  tar -xvzf boost_1_62_0.tar.gz
  rm boost_1_62_0.tar.gz
  mv boost_1_62_0 boost
fi
cd boost
root_dir=`pwd`

# --- Install Boost Building tools (using gcc compilers) (probably not needed, just use headers!)
#mkdir Boost-Build
#cd tools/build/
#./bjam install --prefix=$root_dir/Boost-Build/

# --- Install Boost libraries (probably not needed, just use headers!)
#cd $root_dir
#mkdir gcc_toolset_install
#$root_dir/Boost-Build/bin/bjam --build-dir=$root_dir/gcc_toolset_install/ toolset=gcc stage

# --- Compile test program
cd $root_dir/../
g++ -o run_example example_boost_interprocess.cpp -pthread -I$root_dir/boost -lrt

# --- Run test-program
if [ ! -f "run_example" ] ; then
  echo "Compilation of example_boost_interprocess.cpp seems to have failed"
  echo "Aborting..."
  exit 1
else
  echo "To test the program, run these two commands:"
  echo "./run_example &"
  echo "./run_example child"
fi


exit 0



