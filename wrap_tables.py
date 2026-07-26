import os
import re

for root, _, files in os.walk('behavioral-anomaly-detector/frontend/src'):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'className="table-responsive"' in content:
                continue
                
            if '<table' in content:
                new_content = re.sub(r'(<table[^>]*>)', r'<div className="table-responsive">\1', content)
                new_content = new_content.replace('</table>', '</table></div>')
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Wrapped tables in {filepath}")
