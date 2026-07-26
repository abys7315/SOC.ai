import os

css_fixes = {
    'AttackInjection.css': """
@media screen and (max-width: 768px) {
  .injection-layout { flex-direction: column; }
  .injection-sidebar { width: 100%; height: auto; }
}
""",
    'BehaviorAnalytics.css': """
@media screen and (max-width: 768px) {
  .analytics-grid { grid-template-columns: 1fr; }
  .analytics-layout { flex-direction: column; }
}
""",
    'EntityExplorer.css': """
@media screen and (max-width: 768px) {
  .entity-layout { flex-direction: column; }
  .entity-sidebar { width: 100%; max-height: none; }
  .info-grid { grid-template-columns: 1fr; }
}
""",
    'Evaluation.css': """
@media screen and (max-width: 768px) {
  .evaluation-grid { grid-template-columns: 1fr; }
  .eval-layout { flex-direction: column; }
}
""",
    'SystemHealth.css': """
@media screen and (max-width: 768px) {
  .health-grid { grid-template-columns: 1fr; }
  .node-grid { grid-template-columns: 1fr; }
  .health-layout { flex-direction: column; }
}
""",
    'DataGenerator.css': """
@media screen and (max-width: 768px) {
  .generator-layout { flex-direction: column; }
  .gen-sidebar { width: 100%; }
}
"""
}

for root, _, files in os.walk('behavioral-anomaly-detector/frontend/src/pages'):
    for file in files:
        if file in css_fixes:
            filepath = os.path.join(root, file)
            with open(filepath, 'a', encoding='utf-8') as f:
                f.write(css_fixes[file])
            print(f"Patched {file}")
