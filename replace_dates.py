import os
import re
from datetime import datetime, timedelta
import random

today = datetime.now()
current_year = str(today.year)

frontend_dir = "behavioral-anomaly-detector/frontend/src"
count = 0

for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            original_content = content
            
            # Use regex to find dates like "May 15, 2024" or "Apr 20, 2024"
            # and replace them with a recent date relative to today.
            def date_replacer(match):
                # Subtract random days (0-15) to keep dates slightly staggered but current
                random_days = random.randint(0, 15)
                new_date = today - timedelta(days=random_days)
                return new_date.strftime("%b %d, %Y")

            content = re.sub(r'[A-Z][a-z]{2} \d{2}, 2024', date_replacer, content)
            
            # Replace raw "2024" in strings like "May 2024" -> "Jul 2026"
            content = content.replace("20240510", today.strftime("%Y%m%d"))
            content = content.replace("20240515", today.strftime("%Y%m%d"))
            
            if content != original_content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                count += 1
                print(f"Updated dates in {filepath}")

print(f"Updated {count} files.")
