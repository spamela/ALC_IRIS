# --- simple example of workflow:
# --- modify input file given values from .csv file
./convert_input.sh input_file.template input_values.csv input_file.new
# --- run code with new input file
./example_code.sh input_file.new output_file.template
# --- extract data from code output into .csv file
./convert_output.sh output_file.template output_values.csv




  input_file.template     input_values.csv
                \            /
                 \          /
                  \        /
                   \      /
                    \    /
               convert_input.sh
                       |
                       |
                       V               ----
               input_file.new             |
                       |                  |
                       |                  |
                       V                  |
               example_code.sh            |-> generic user workflow
                       |                  |
                       |                  |
                       V                  |
             output_file.template         |
                       |               ----
                       |
                       V
              convert_output.sh
                       |
                       |
                       V
              output_values.csv




