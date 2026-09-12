# Python script to enrich and patch all languages in src/i18n/index.ts
import re

with open('src/i18n/index.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify that file reads properly
print(f"Read index.ts, length: {len(content)} chars")
