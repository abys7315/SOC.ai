# Kaggle Training Instructions

Because the sequence-aware model uses a deep recurrent architecture (GRU with Attention), it benefits significantly from GPU acceleration during training. To accommodate environments without a local GPU, this project is designed so that training can be offloaded to Kaggle's free GPU tier, while the synthetic data generation and final dashboard inference run locally on CPU.

## Step-by-step Guide

### 1. Upload the Dataset to Kaggle
1. Run the local synthetic data generator to create your training data:
   ```bash
   python data/generator.py --entities 500 --days 60
   ```
2. This creates a file at `data/generated/synthetic_data.csv`.
3. Log into [Kaggle](https://www.kaggle.com).
4. Navigate to **Datasets** -> **New Dataset**.
5. Upload `synthetic_data.csv`. Give the dataset a clear name (e.g., `honeywell-anomaly-data`).

### 2. Set Up the Training Notebook
1. In Kaggle, click **Create** -> **New Notebook**.
2. Go to the right sidebar and click **Add Data**. Search for and add the dataset you uploaded in Step 1.
3. Import the `train_on_kaggle.ipynb` notebook into your Kaggle session:
   - Go to **File** -> **Import Notebook** and select the local `notebooks/train_on_kaggle.ipynb` file.
4. Enable GPU acceleration:
   - On the right sidebar, under **Session Options**, find the **Accelerator** dropdown.
   - Select **GPU T4 x2** or **GPU P100**.

### 3. Run the Training
1. In the notebook, update the dataset path in the training cell if necessary. Kaggle typically mounts datasets under `/kaggle/input/your-dataset-name/synthetic_data.csv`.
2. Run all cells from top to bottom (`Run All`).
3. The notebook will process the data, handle the class imbalance weighting, train the sequence model for the specified number of epochs, and save the final artifacts.
4. Keep the Kaggle tab open until execution completes, as interactive sessions have an idle timeout.

### 4. Download and Deploy the Artifacts
1. Once training is complete, expand the **Output** section in the right sidebar (under `/kaggle/working/`).
2. Download the two resulting artifact files:
   - `model_final.pt` (the PyTorch model weights)
   - `preprocessor.pkl` (the fitted label encoders and scalers)
3. Move these downloaded files into the local project repository under the `models/artifacts/` directory.
4. You can now launch the local demo:
   ```bash
   python run_demo.py
   ```
   The local API will automatically detect and load your newly trained GPU model for real-time CPU inference.
