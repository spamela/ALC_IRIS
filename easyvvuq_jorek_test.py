import os
import easyvvuq as uq
import chaospy as cp

# 0. Setup some variables describing app to be run
#
#    gauss.py is in current directory and takes one input file
#    and writes to 'output.csv'.
cwd = os.getcwd()
input_filename = 'intear_input'
cmd = f"{cwd}/run_jorek.perl {input_filename}"
out_file = "output.csv"
# Template input to substitute values into for each run
template = f"{cwd}/intear.template"

# 1. Create campaign
my_campaign = uq.Campaign(name='jorek_intear', work_dir=".")

# 2. Parameter space definition
params = {
    "FF_0_input": {
        "type": "float",
        "min": 1.0,
        "max": 2.0,
        "default": 1.173
    },
    "T_0_input": {
        "type": "float",
        "min": 1.e-7,
        "max": 1.e-4,
        "default": 1.e-6
    },
    "R_geo_input": {
        "type": "float",
        "min": 9.0,
        "max": 11.0,
        "default": 10.0
    }
}

# 3. Wrap Application
#    - Define a new application (we'll call it 'gauss'), and the encoding/decoding elements it needs
encoder = uq.encoders.GenericEncoder(template_fname=template,
                                     target_filename=input_filename)

decoder = uq.decoders.SimpleCSV(
            target_filename=out_file,
            output_columns=['Volume', 'Current'],
            header=0)

my_campaign.add_app(name="jorek_intear",
                    params=params,
                    encoder=encoder,
                    decoder=decoder
                    )

# 4. Set a collation element
#    - This will be responsible for aggregating the results
collater = uq.collate.AggregateSamples(average=True)
my_campaign.set_collater(collater)

# 5. Specify Sampler
#    -  vary the `mu` parameter only
vary = {
    "FF_0_input": cp.Uniform(1.0, 2.0),
}

my_sampler = uq.sampling.RandomSampler(vary=vary)

my_campaign.set_sampler(my_sampler)

# 6. Get run parameters
my_campaign.draw_samples(num_samples=3,
                         replicas=2)

# 7. Create run input directories
my_campaign.populate_runs_dir()

# 8. Run Application
#    - gauss is executed for each sample
my_campaign.apply_for_each_run_dir(uq.actions.ExecuteLocal(cmd))

# 9. Collate output
my_campaign.collate()

my_campaign.get_collation_result().to_csv('error.csv')


# 10. Run Analysis
#     - Calculate bootstrap statistics for collated data
stats = uq.analysis.EnsembleBoot(groupby=["FF_0_input"], qoi_cols=["Current"])
my_campaign.apply_analysis(stats)
print("stats:\n", my_campaign.get_last_analysis())

