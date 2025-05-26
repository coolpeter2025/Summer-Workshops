const fs = require('fs');
const path = require('path');

// Simple image compression by converting to smaller versions
// This creates a basic HTML canvas compression

const compressImages = () => {
    const imagesDir = path.join(__dirname, 'images');
    const compressedDir = path.join(__dirname, 'images', 'compressed');
    
    // Create compressed directory
    if (!fs.existsSync(compressedDir)) {
        fs.mkdirSync(compressedDir, { recursive: true });
    }
    
    // List all PNG files
    const files = fs.readdirSync(imagesDir).filter(file => file.endsWith('.png'));
    
    console.log('Found images to compress:', files);
    
    // For now, let's just copy them to compressed folder with better names
    const imageMap = {
        'Image May 25, 2025, 10_34_15 PM.png': 'workshop-1.png',
        'Image May 25, 2025, 10_34_18 PM.png': 'workshop-2.png', 
        'Image May 25, 2025, 10_34_40 PM.png': 'workshop-3.png',
        'Image May 25, 2025, 10_35_32 PM.png': 'workshop-4.png',
        'Image May 25, 2025, 10_35_35 PM.png': 'workshop-5.png',
        'Image May 25, 2025, 10_36_28 PM.png': 'workshop-6.png',
        'Image May 25, 2025, 10_46_05 PM.png': 'workshop-7.png',
        'Image May 25, 2025, 10_46_07 PM.png': 'workshop-8.png',
        'Image May 25, 2025, 10_46_08 PM.png': 'workshop-9.png',
        'Image May 25, 2025, 10_47_47 PM.png': 'workshop-10.png',
        'T Image May 25, 2025, 10_34_20 PM.png': 'workshop-11.png'
    };
    
    files.forEach(file => {
        if (imageMap[file]) {
            const srcPath = path.join(imagesDir, file);
            const destPath = path.join(compressedDir, imageMap[file]);
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${file} -> ${imageMap[file]}`);
        }
    });
    
    console.log('Image organization complete!');
};

compressImages();