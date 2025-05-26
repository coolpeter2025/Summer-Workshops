#!/usr/bin/env python3
import base64
from io import BytesIO

# Create minimal placeholder images as base64 encoded data
def create_placeholder_svg(width, height, text, bg_color, text_color):
    svg_content = f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="{bg_color}"/>
    <text x="50%" y="50%" text-anchor="middle" dy="0.35em" 
          font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="{text_color}">
        {text}
    </text>
</svg>'''
    return svg_content

# Create placeholder SVGs
placeholders = [
    ("Creative Arts & Crafts", "#6366f1", "#ffffff"),
    ("Learning Adventures", "#ec4899", "#ffffff"), 
    ("Group Activities", "#f59e0b", "#1f2937"),
    ("Workshop Fun", "#10b981", "#ffffff")
]

for i, (text, bg, fg) in enumerate(placeholders, 1):
    svg_content = create_placeholder_svg(400, 300, text, bg, fg)
    
    # Save as SVG file
    with open(f'placeholder-{i}.svg', 'w') as f:
        f.write(svg_content)
    
    print(f"Created placeholder-{i}.svg")

print("All placeholder images created!")