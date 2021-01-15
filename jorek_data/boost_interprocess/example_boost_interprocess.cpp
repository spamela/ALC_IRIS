//Boost libraries
#include <boost/interprocess/managed_shared_memory.hpp>
#include <boost/interprocess/allocators/allocator.hpp>
#include <boost/interprocess/containers/string.hpp>
//std libraries
#include <cstdlib> //std::system
#include <cstddef>
#include <cassert>
#include <utility>
//file-read libraries
#include <iostream>
#include <fstream>
#include <iterator>
#include <vector>


int main(int argc, char *argv[])
{
  using namespace boost::interprocess;
  //Boost string types
  typedef allocator<char, managed_shared_memory::segment_manager> CharAllocator;
  typedef basic_string<char, std::char_traits<char>, CharAllocator> string;

  printf("\n");

  //Parent process
  if(argc == 1)
  {
    //File reading variables
    FILE * pFile;
    long lSize;
    char *buffer;
    size_t result;

    //Read a text file
    printf("Reading txt file...\n");
    pFile = fopen ( "myfile.txt" , "r" );
    if (pFile==NULL) {fputs ("File error",stderr); exit (1);}
    //Get file size:
    fseek (pFile , 0 , SEEK_END);
    lSize = ftell (pFile);
    rewind (pFile);
    //Allocate memory to contain the whole file:
    buffer = (char*) malloc (sizeof(char)*lSize);
    if (buffer == NULL) {fputs ("Memory error",stderr); exit (2);}
    //Copy the file into the buffer:
    result = fread (buffer,1,lSize,pFile);
    if (result != lSize) {fputs ("Reading error",stderr); exit (3);}
    //Close file
    fclose (pFile);

    //Read a binary file
    printf("Reading unformatted file...\n");
    std::ifstream file_stream("myfile.txt");
    file_stream.seekg(0, std::ios::end);
    size_t size = file_stream.tellg();
    std::string buffer_sbin(size, ' ');
    file_stream.seekg(0);
    file_stream.read(&buffer_sbin[0], size); 
    std::cout << "byte 0 in file: " << buffer_sbin[0] << "\n";

    //Remove shared memory on construction and destruction
    struct shm_remove
    {
      shm_remove() { shared_memory_object::remove("Boost_shared_memory"); }
      ~shm_remove(){ shared_memory_object::remove("Boost_shared_memory"); }
    } remover;

    //Construct managed shared memory
    managed_shared_memory managed_shm{open_or_create, "Boost_shared_memory", 10000};

    try
    {
      //Just an integer
      int *shared_i = managed_shm.construct<int>("Integer")(99);
      //An array of identical integers (I don't understand how this can ever be useful...)
      int *shared_j = managed_shm.construct<int>("Integer_identical_array")[10](99);
      //An array of integers
      int int_initializer[3] = { 0, 1, 2 };
      int *shared_k = managed_shm.construct_it<int>("Integer_array")[3](&int_initializer[0]);
      //A string
      string *shared_s = managed_shm.construct<string>("String")("Hello!", managed_shm.get_segment_manager());
      //A string from file
      //string *shared_fs = managed_shm.construct<string>("FileString")(buffer, managed_shm.get_segment_manager());
      string *shared_fs = managed_shm.construct<string>("FileString")(buffer_sbin.c_str(), managed_shm.get_segment_manager());
    }catch (boost::interprocess::bad_alloc &ex)
    {
      printf("Allocation error for shared memory: %s\n",ex.what());
    }

    //Free file buffer
    free (buffer);

    //Sleep a little while memory is kept in background for child processes
    int n_sleep = 6;
    printf("Memory allocated, process sleeping for [%d * 10 seconds]\n",n_sleep);
    for(int i=0; i<n_sleep ; i++)
    {
      printf("Process running, time remaining: [%d * 10 seconds]\n",n_sleep-i);
      sleep(10);
    }

  }else
  {
    //Open managed shared memory
    managed_shared_memory managed_shm{open_only, "Boost_shared_memory"};

    //Find integer
    std::pair<int*, std::size_t> shared_i = managed_shm.find<int>("Integer");
    if (shared_i.first)
      printf("Integer found: %d\n",*shared_i.first);
    //Find integer identical array
    std::pair<int*, std::size_t> shared_j = managed_shm.find<int>("Integer_identical_array");
    if (shared_j.first)
    {
      printf("Integer identical array of size %ld found: %d %d\n",shared_j.second,shared_j.first[0],shared_j.first[1]);
    }
    //Find integer identical array
    std::pair<int*, std::size_t> shared_k = managed_shm.find<int>("Integer_array");
    if (shared_k.first)
    {
      printf("Integer array of size %ld found: %d %d %d\n",shared_k.second,shared_k.first[0],shared_k.first[1],shared_k.first[2]);
    }
    //Find string
    std::pair<string*, std::size_t> shared_s = managed_shm.find<string>("String");
    if (shared_s.first)
    {
      std::cout << "String found:"  << *shared_s.first << "\n";
    }
    //Find string from file
    std::pair<string*, std::size_t> shared_fs = managed_shm.find<string>("FileString");
    if (shared_fs.first)
    {
      std::cout << "File string found:"  << *shared_fs.first << "\n";
    }
  }
  return 0;
}
