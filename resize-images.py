#!/usr/bin/env python3
import os
from PIL import Image
import sys

def resize_images():
    images_dir = "images"
    compressed_dir = os.path.join(images_dir, "compressed")
    
    # Create compressed directory
    os.makedirs(compressed_dir, exist_ok=True)
    
    # Image mapping
    image_map = {
        'Image May 25, 2025, 10_34_15 PM.png': 'workshop-1.jpg',
        'Image May 25, 2025, 10_34_18 PM.png': 'workshop-2.jpg', 
        'Image May 25, 2025, 10_34_40 PM.png': 'workshop-3.jpg',
        'Image May 25, 2025, 10_35_32 PM.png': 'workshop-4.jpg'
    }
    
    for original_name, new_name in image_map.items():
        input_path = os.path.join(images_dir, original_name)
        output_path = os.path.join(compressed_dir, new_name)
        
        if os.path.exists(input_path):
            try:
                with Image.open(input_path) as img:
                    # Convert to RGB if needed
                    if img.mode in ('RGBA', 'LA', 'P'):
                        img = img.convert('RGB')
                    
                    # Resize to max 800px width while maintaining aspect ratio
                    width, height = img.size
                    if width > 800:
                        new_width = 800
                        new_height = int((height * new_width) / width)
                        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Save as JPEG with quality 85
                    img.save(output_path, 'JPEG', quality=85, optimize=True)
                    print(f"Compressed {original_name} -> {new_name}")
                    
                    # Get file sizes
                    original_size = os.path.getsize(input_path)
                    compressed_size = os.path.getsize(output_path)
                    compression_ratio = (1 - compressed_size/original_size) * 100
                    print(f"  Size: {original_size//1024}KB -> {compressed_size//1024}KB ({compression_ratio:.1f}% reduction)")
                    
            except Exception as e:
                print(f"Error processing {original_name}: {e}")
        else:
            print(f"File not found: {input_path}")

if __name__ == "__main__":
    resize_images()