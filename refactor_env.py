import os
import glob
import re

frontend_src = r"c:\Users\abys7\Downloads\honeywellfinal\behavioral-anomaly-detector\frontend\src"
files = glob.glob(os.path.join(frontend_src, "**", "*.jsx"), recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content

    needs_api = "fetch('/" in content or "fetch(`/" in content or "fetch(`${API_BASE}" in content
    needs_ws = "new WebSocket(" in content

    if needs_api or needs_ws:
        rel_path = os.path.relpath(file, frontend_src)
        depth = rel_path.count(os.sep)
        if depth == 0:
            config_import_path = "./config"
        else:
            config_import_path = "../" * depth + "config"
        config_import_path = config_import_path.replace('\\', '/')
        
        if "API_BASE" not in content and "WS_BASE" not in content:
            import_statement = f"import {{ API_BASE, WS_BASE }} from '{config_import_path}';\n"
            lines = new_content.split('\n')
            last_import_idx = -1
            for i, line in enumerate(lines):
                if line.startswith("import "):
                    last_import_idx = i
            
            if last_import_idx != -1:
                lines.insert(last_import_idx + 1, import_statement)
                new_content = '\n'.join(lines)
            else:
                new_content = import_statement + new_content

        # Replace fetch('/path'...)
        new_content = re.sub(r"fetch\('(/[^']+)'", r"fetch(`${API_BASE}\1`", new_content)
        # Replace fetch(`/path`...)
        new_content = re.sub(r"fetch\(`(/[^`]+)`", r"fetch(`${API_BASE}\1`", new_content)

        # Replace WebSocket URL
        new_content = re.sub(r"new WebSocket\(`\$\{window\.location\.protocol === 'https:' \? 'wss:' : 'ws:'\}//\$\{window\.location\.host\}(/ws/[^`]+)`\)", r"new WebSocket(`${WS_BASE}\1`)", new_content)
        
        # Handle App.jsx specifics
        if "App.jsx" in file:
            new_content = new_content.replace("const API_BASE = '';\n", "")
            new_content = new_content.replace("const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/alerts`;\n", "")
            new_content = new_content.replace("new WebSocket(WS_URL)", "new WebSocket(`${WS_BASE}/ws/alerts`)")

    if content != new_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

print("Done")
