import os
import zipfile
import argparse

def create_zip(target_file="submission.zip", kaggle_mode=False):
    exclude_dirs = ['.git', '__pycache__', '.pytest_cache']
    
    if not kaggle_mode:
        # For final submission, exclude large generated files
        exclude_dirs.extend(['data/generated', 'models/artifacts'])
        
    with zipfile.ZipFile(target_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if not any(ex in os.path.join(root, d).replace('\\', '/') for ex in exclude_dirs)]
            
            for file in files:
                if file == target_file or file.endswith('.zip'):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, '.')
                zipf.write(file_path, arcname)
                
    print(f"Created {target_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--kaggle', action='store_true', help="Include generated data for Kaggle upload")
    args = parser.parse_args()
    
    if args.kaggle:
        create_zip("kaggle_dataset.zip", kaggle_mode=True)
    else:
        create_zip("submission.zip", kaggle_mode=False)
