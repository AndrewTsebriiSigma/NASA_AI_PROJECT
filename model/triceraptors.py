import numpy as np
import pandas as pd
import time
import matplotlib.pyplot as plt

import triceratops.triceratops as tr


ID = 300038935
sectors = np.array([1])
target = tr.target(ID=ID,                       # TIC ID (int)
                   sectors=sectors,             # TESS sectors (numpy array)
                   search_radius=10,            # number of pixels to search from target star (int)
                   mission="TESS",              # which mission you are using data from ("TESS" or "Kepler" currently supported)
                   lightkurve_cache_dir=None,   # directory containing lightkurve data products (str)
                   trilegal_fname=None,         # name of TRILEGAL query results (str, generated after first run)
                   ra=None,                     # ra if target ID is unknown (float, degrees)
                   dec=None)  

target.calc_probs(time=t_binned,                               # binned time data
                  flux_0=y_binned,                             # binned flux data
                  flux_err_0=np.std(y_binned[:50]),            # standard deviation of (out-of-transit) flux data
                  P_orb=29.04992,                              # best-fit orbital period of planet candidate
                  contrast_curve_file="TOI1228_cc.tbl",        # contrast curve file to use (str)
                  filt="TESS",                                 # passband of contrast curve ("TESS", "J", "H", or "K")
                  N=int(1e6),                                  # number of instances to simulate for each scenario (int, usually fine to leave alone)
                  parallel=True,                               # whether or not to use parallel processing (bool)
                  drop_scenario=[],                            # scenarios to ignore (e.g., "EB")
                  verbose=1,                                   # whether or not to print updates (0 or 1)
                  flatpriors=False,                            # whether or not to assume flat planet priors (bool)
                  exptime=0.00139,                             # exposure time of TESS data (float, in days)
                  nsamples=20,                                 # number of samples to use for supersampling (int, leave alone)
                  molusc_file="TOI1228_molusc_kept.csv") 

print("FPP =", target.FPP)
print("NFPP =", target.NFPP)