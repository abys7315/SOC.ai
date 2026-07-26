import os
import glob

frontend_src = r"c:\Users\abys7\Downloads\honeywellfinal\behavioral-anomaly-detector\frontend\src"

files = glob.glob(os.path.join(frontend_src, "**", "*.jsx"), recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    # Replace HTTP
    new_content = new_content.replace("'http://localhost:8000/", "'/")
    new_content = new_content.replace("`http://localhost:8000/", "`/")
    new_content = new_content.replace('"http://localhost:8000/', '"/')
    new_content = new_content.replace("'http://localhost:8000'", "''")
    new_content = new_content.replace('const API_BASE = \'http://localhost:8000\';', 'const API_BASE = \'\';')

    # Replace WS
    new_content = new_content.replace("'ws://localhost:8000/", "`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/")
    new_content = new_content.replace('"ws://localhost:8000/', '`${window.location.protocol === \'https:\' ? \'wss:\' : \'ws:\'}//${window.location.host}/')

    if content != new_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

print("Done")
