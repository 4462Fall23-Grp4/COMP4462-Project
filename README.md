# COMP4462 Project - Group 4

Project: HKUST CSE Department Google Scholar Visualization

## Data Visualisation wesbite 

The data visualisation has been deployed to https://4462fall23-grp4.github.io/COMP4462-Project/.

### Prerequisite
- Download Node.js and npm by following https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

### Quick Start

1. `cd gs-vis-project`
2. `npm install`
3. `npm run dev`

## Data preprocessing 

All the codes for data preprocessing have been run prior launching the website, and all data are kept static. Running the codes in `/data-preprocessing` directory may not result in the same output. Please refer to `/gs-vis-project/src/data` for the final preprocessed data.

### Prerequisite
- Install `scholarly` following https://scholarly.readthedocs.io/en/stable/quickstart.html
- Install `pandas`

### `data_preprocessing1.ipynb`

This notebook did the following:
- Fetch Google scholar information of each HKUST CSE regular faculty member (manually one by one)
- Preprocess the data for publication per year line graph and intra-department coauthorship network

### `data_preprocessing2.ipynb`

This notebook did the following:
- Fetch the detail profile for all the coauthors
- Fetch the organizatin name by organization ID
- Map the organization name to country / region (need to manually map for uncommon organization )