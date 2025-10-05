import os
import numpy as np
import pandas as pd
import triceratops.triceratops as tr
import lightkurve as lk
import shutil

def clean_cache_folders(trilegal_cache_dir, k2_lc_cache_dir):
    """
    Remove all files in the trilegal and k2_lk cache directories.
    """
    for cache_dir in [trilegal_cache_dir, k2_lc_cache_dir]:
        if os.path.exists(cache_dir):
            for filename in os.listdir(cache_dir):
                file_path = os.path.join(cache_dir, filename)
                try:
                    if os.path.isfile(file_path) or os.path.islink(file_path):
                        os.remove(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    print(f"Failed to delete {file_path}: {e}")

def patch_star_table(target, planet_row):
    """
    Ensure that target.stars has all columns needed for calc_probs:
    mass, rad, Teff, logg, plx, Tmag, fluxratio.
    planet_row is a pandas Series from your CSV row for this planet.
    """
    stars = target.stars
    # Use in‑place additions
    # 1. mass
    if "mass" not in stars.columns and "st_mass" in planet_row:
        stars["mass"] = planet_row["st_mass"]
    # 2. radius
    if "rad" not in stars.columns and "st_rad" in planet_row:
        stars["rad"] = planet_row["st_rad"]
    # 3. Teff
    if "Teff" not in stars.columns and "st_teff" in planet_row:
        stars["Teff"] = planet_row["st_teff"]
    # 4. logg
    if "logg" not in stars.columns:
        if "st_logg" in planet_row and not pd.isna(planet_row["st_logg"]):
            stars["logg"] = planet_row["st_logg"]
        elif ("mass" in stars.columns) and ("rad" in stars.columns):
            # Compute logg: log10(g) in cgs; g = G M / R^2
            # Use solar constants: log10(g_sun) ~ 4.437 (g_sun ~ 27400 cm/s²)
            G_SUN_LOG10 = 4.437
            stars["logg"] = G_SUN_LOG10 + np.log10(stars["mass"]) - 2 * np.log10(stars["rad"])
        else:
            print("Warning: cannot compute logg (missing mass or rad).")
    # 5. plx (parallax, in mas)
    if "plx" not in stars.columns and "sy_dist" in planet_row:
        dist = planet_row["sy_dist"]
        if dist > 0:
            stars["plx"] = 1000.0 / dist
    # 6. Tmag
    if "Tmag" not in stars.columns:
        # Prefer sy_vmag
        vmag = planet_row.get("sy_vmag", np.nan)
        if not pd.isna(vmag):
            stars["Tmag"] = vmag
        else:
            # fallback: sy_kmag (approx shift)
            kmag = planet_row.get("sy_kmag", np.nan)
            if not pd.isna(kmag):
                stars["Tmag"] = kmag + 1.5
                print("Note: Tmag estimated from Kmag + 1.5")
    # 7. fluxratio
    if "fluxratio" not in stars.columns:
        if "Tmag" in stars.columns:
            T0 = stars.iloc[0]["Tmag"]
            # Compute ratio: 10^(-0.4 * (T_i - T0))
            stars["fluxratio"] = stars["Tmag"].apply(lambda T: 10 ** (-0.4 * (T - T0)))
        else:
            print("Warning: cannot compute fluxratio (missing Tmag).")

    if "[M/H]" not in stars.columns and "st_met" in planet_row:
        stars["[M/H]"]  = planet_row["st_met"]

def run_fpp_for_planet(planet, csv_base_path, k2_lc_cache_dir, trilegal_cache_dir, search_radius = 10):
    """
    Run triceratops FPP analysis for one planet (row from DataFrame).
    Returns (FPP, NFPP) or (None, None) on error.
    """
    # Clean cache folders before patching star table
    clean_cache_folders(trilegal_cache_dir, k2_lc_cache_dir)
    # Extract basic info
    hostname = planet["hostname"]
    if(hostname.split()[0]!="EPIC"):
        return "Nan", "Nan"

    try:
        ID = int(hostname.split()[-1])
    except ValueError:
        print(f"Skipping target: cannot parse EPIC from hostname '{hostname}'")
        return None, None

    ra = float(planet["ra"])
    dec = float(planet["dec"])
    sectors = np.array([0])  # K2 campaign dummy
    mission = "K2"
    search_radius = search_radius

    # Prepare TRILEGAL cache filename
    os.makedirs(trilegal_cache_dir, exist_ok=True)
    trilegal_fname = os.path.join(trilegal_cache_dir, f"trilegal_EPIC{ID}.csv")

    # Remove zero-byte stale file
    if os.path.exists(trilegal_fname) and os.path.getsize(trilegal_fname) == 0:
        print(f"Empty TRILEGAL file found and removed: {trilegal_fname}")
        os.remove(trilegal_fname)

    # Instantiate target, letting triceratops simulate TRILEGAL if needed
    if os.path.exists(trilegal_fname):
        print(f"Loading TRILEGAL from cache: {trilegal_fname}")
        target = tr.target(
            ID=ID,
            sectors=sectors,
            search_radius=search_radius,
            mission=mission,
            lightkurve_cache_dir=k2_lc_cache_dir,
            trilegal_fname=trilegal_fname,
            ra=ra,
            dec=dec
        )
    else:
        print("No TRILEGAL cache — generating new.")
        target = tr.target(
            ID=ID,
            sectors=sectors,
            search_radius=search_radius,
            mission=mission,
            lightkurve_cache_dir=k2_lc_cache_dir,
            trilegal_fname=trilegal_fname,
            ra=ra,
            dec=dec
        )

        # Patch before saving
        patch_star_table(target, planet)

        if "Mact" not in target.stars.columns and "mass" in target.stars.columns:
            target.stars["Mact"] = target.stars["mass"]
        
        if "J" not in target.stars.columns and "Jmag" in target.stars.columns:
            target.stars["J"] = target.stars["Jmag"]
        
        if "H" not in target.stars.columns and "Hmag" in target.stars.columns:
            target.stars["H"] = target.stars["Hmag"]
        
        if "Ks" not in target.stars.columns and "Kmag" in target.stars.columns:
            target.stars["Ks"] = target.stars["Kmag"]

        if "TESS" not in target.stars.columns and "Tmag" in target.stars.columns:
            target.stars["TESS"] = target.stars["Tmag"]

        if "logTe" not in target.stars.columns and "Teff" in target.stars.columns:
            target.stars["logTe"] = target.stars["Teff"].apply(
                lambda T: np.log10(T) if T > 0 else np.nan
            )


        try:
            target.stars.to_csv(trilegal_fname, index=False)
            print(f"Saved TRILEGAL output to {trilegal_fname}")
        except Exception as e:
            print("Warning: failed to save TRILEGAL output:", e)


    # Diagnostics
    print("Star table columns:", target.stars.columns.tolist())
    print("Number of stars:", len(target.stars))

    # Download K2 light curve
    search_result = lk.search_lightcurve(hostname, mission="K2")
    if len(search_result) == 0:
        print(f"No light curve found for {hostname}")
        return None, None
    lc = search_result.download()
    lc = lc.flatten(window_length=401).remove_outliers(sigma=5)

    time_arr = lc.time.value
    flux_arr = lc.flux.value
    flux_err = np.std(flux_arr)

    # Estimate transit depth (ppm)
    tdepth_est = (1.0 - np.min(flux_arr)) * 1e6
    print(f"Estimated depth: {tdepth_est:.2f} ppm")

    target.stars["tdepth"] = tdepth_est  # assign to all rows

    # Patch missing columns needed internally
    patch_star_table(target, planet)

    # Also ensure “Mact” exists (expected by internal CSV reader)
    if "Mact" not in target.stars.columns and "mass" in target.stars.columns:
        target.stars["Mact"] = target.stars["mass"]

    # Call calc_probs with P_orb as at least 1D
    P_orb = np.atleast_1d(planet["pl_orbper"])

    # try:
    target.calc_probs(
        time=time_arr,
        flux_0=flux_arr,
        flux_err_0=flux_err,
        P_orb=P_orb,
        contrast_curve_file=None,
        filt="Kepler",
        N=10000,
        parallel=True,
        drop_scenario=[],
        verbose=1,
        flatpriors=False,
        exptime=0.0204,
        nsamples=1000
    )
    # except Exception as e:
    #     print("Error during calc_probs:", e)
    #     return None, None

    return target.FPP, target.NFPP

def main():
    for i in range(15):
        df = pd.read_csv("exoplanets_to_confirm.csv")
        df_default = df[df["default_flag"] == 1]

        planet = df_default.iloc[i]

        FPP, NFPP = run_fpp_for_planet(planet,
                                    csv_base_path="exoplanets_to_confirm.csv",
                                    k2_lc_cache_dir="data/k2_lk/",
                                    trilegal_cache_dir="data/trilegal", 
                                    search_radius=20)
        print("Final result:", FPP, NFPP)
        # if NFPP < 0.1 planet, else not planet
        if NFPP < 0.1:
            print("Confirmed planet")
        else:
            print("Not a planet")

if __name__ == "__main__":
    main()
