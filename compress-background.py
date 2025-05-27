#!/usr/bin/env python3
"""
Compress the w3.png background image to a smaller size for better online loading
"""
try:
    from PIL import Image
    import os
    
    def compress_background_image():
        input_file = "w3.png"
        output_file = "w3-compressed.jpg"
        
        if not os.path.exists(input_file):
            print(f"Error: {input_file} not found")
            return
            
        print(f"Compressing {input_file}...")
        
        # Open and process the image
        with Image.open(input_file) as img:
            # Convert to RGB if needed (for JPEG)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'RGBA':
                    background.paste(img, mask=img.split()[-1])
                else:
                    background.paste(img)
                img = background
            
            # Resize to reasonable dimensions for web
            original_size = img.size
            max_width = 1200
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                print(f"Resized from {original_size} to {img.size}")
            
            # Save as JPEG with high quality but good compression
            img.save(output_file, 'JPEG', quality=85, optimize=True)
            
            # Show file size comparison
            original_size_mb = os.path.getsize(input_file) / (1024 * 1024)
            compressed_size_mb = os.path.getsize(output_file) / (1024 * 1024)
            reduction = ((original_size_mb - compressed_size_mb) / original_size_mb) * 100
            
            print(f"✅ Compression complete!")
            print(f"Original: {original_size_mb:.2f} MB")
            print(f"Compressed: {compressed_size_mb:.2f} MB")
            print(f"Reduction: {reduction:.1f}%")
            print(f"Output file: {output_file}")
            
    if __name__ == "__main__":
        compress_background_image()
        
except ImportError:
    print("PIL (Pillow) not available. Creating a simple copy instead...")
    import shutil
    import os
    
    # Just copy the file with a new name as fallback
    if os.path.exists("w3.png"):
        shutil.copy("w3.png", "w3-compressed.jpg")
        print("Created w3-compressed.jpg (copy of original)")
    else:
        print("w3.png not found")