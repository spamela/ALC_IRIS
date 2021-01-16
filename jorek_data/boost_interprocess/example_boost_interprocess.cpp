//Boost libraries
#include <boost/interprocess/managed_shared_memory.hpp>
#include <boost/interprocess/allocators/allocator.hpp>
#include <boost/interprocess/containers/string.hpp>
#include <boost/interprocess/shared_memory_object.hpp>
#include <boost/interprocess/mapped_region.hpp>
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


  //Input file (note: "binary" flag needs to be consistent with tile)
  //char input_filename[]  = "myfile.txt";
  char input_filename[]  = "myfile_short.bin";
  //Output file
  char output_filename[] = "output.file.tmp";


  printf("\n");

  //Parent process (allocates memory, and then sleeps while other processes can be launched)
  if(argc == 1)
  {
    //We have a first shared memory map for various variables
    struct shm_remove //Remove shared memory on construction and destruction
    {
      shm_remove() { shared_memory_object::remove("Boost_shared_memory"); }
      ~shm_remove(){ shared_memory_object::remove("Boost_shared_memory"); }
    } remover;
    //Construct managed shared memory
    managed_shared_memory managed_shm{open_or_create, "Boost_shared_memory", 1000000};

    //We have a second shared memory map for a binary file content
    struct file_shm_remove //Remove shared memory on construction and destruction 
    {
       file_shm_remove() { shared_memory_object::remove("Boost_shared_file"); }
       ~file_shm_remove(){ shared_memory_object::remove("Boost_shared_file"); }
    } remover_file;
    //Construct shared memory object
    shared_memory_object shdmem{open_or_create, "Boost_shared_file", read_write};

    //Now try to allocate the memory
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

      //Now read a file...
      FILE * pFile;
      long file_size;
      size_t result;
      //Read a text/binary file
      printf("Reading file \"%s\" into shared memory...\n",input_filename);
      pFile = fopen ( input_filename, "rb" );
      if (pFile==NULL) {fputs ("File error",stderr); exit (1);}
      //Get file size:
      fseek (pFile , 0 , SEEK_END);
      file_size = ftell (pFile);
      rewind (pFile);
      //Allocate shared memory object to contain the file exactly (this is very important, not less, not more!)
      shdmem.truncate(sizeof(char)*file_size);
      //Map this memory region
      mapped_region region{shdmem, read_write};
      //Create character buffer with pointer to the address of mapped region
      char *buffer = static_cast<char*>(region.get_address());
      //Copy the file into the buffer
      result = fread (buffer,1,file_size,pFile);
      if (result != file_size) {fputs ("Reading error",stderr); exit (3);}
      //Close file
      fclose (pFile);
      //Finally, we used the other shared memory to communicate the size of the file (needed for write file out...)      
      long *shared_file_size = managed_shm.construct<long>("file_size")(file_size);

    }catch (boost::interprocess::bad_alloc &ex)
    {
      printf("Allocation error for shared memory: %s\n",ex.what());
    }

    //Sleep a little while memory is kept in background for child processes
    printf("\n");
    int n_sleep = 6;
    printf("Memory allocated, process sleeping for [%d * 10 seconds]\n",n_sleep);
    for(int i=0; i<n_sleep ; i++)
    {
      printf("Process running, time remaining: [%d * 10 seconds]\n",n_sleep-i);
      sleep(10);
    }

  //Child processes (need dummy argument after executable)
  }else
  {
    //Open managed shared memory
    managed_shared_memory managed_shm{open_only, "Boost_shared_memory"};

    printf("These are the shared data you have retrieved:\n");
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
    //Find integer array
    std::pair<int*, std::size_t> shared_k = managed_shm.find<int>("Integer_array");
    if (shared_k.first)
    {
      printf("Integer array of size %ld found: %d %d %d\n",shared_k.second,shared_k.first[0],shared_k.first[1],shared_k.first[2]);
    }
    //Find string
    std::pair<string*, std::size_t> shared_s = managed_shm.find<string>("String");
    if (shared_s.first)
    {
      std::cout << "String found: "  << *shared_s.first << "\n";
    }

    printf("\n");
    //Get the file from shared memory object
    shared_memory_object shdmem{open_only, "Boost_shared_file", read_write};
    //Map shared memory
    mapped_region region2{shdmem, read_only};
    //Create character buffer with pointer to the address of mapped region
    char *buffer_read = static_cast<char*>(region2.get_address());
    printf("Retrieved file content from shared memory\n");
    //Get the size of the file buffer
    std::pair<long*, std::size_t> shared_file_size = managed_shm.find<long>("file_size");
    long buf_size = *shared_file_size.first;
    //Finally, write data back into another file
    printf("Writing file back out as \"%s\"...\n", output_filename);
    FILE * pFile;
    pFile = fopen (output_filename, "wb");
    fwrite (buffer_read , 1, buf_size, pFile);
    fclose (pFile);

  }
  return 0;
}
