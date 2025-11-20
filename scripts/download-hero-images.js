const https = require('https');
const fs = require('fs');
const path = require('path');

// High-quality fashion/lifestyle images from Unsplash
const sampleImages = [
  {
    url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80',
    name: 'hero1.jpg',
    description: 'Fashion storefront'
  },
  {
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
    name: 'hero2.jpg',
    description: 'Fashion models'
  },
  {
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
    name: 'hero3.jpg',
    description: 'Fashion accessories'
  },
  {
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    name: 'hero4.jpg',
    description: 'Fashion products'
  },
];

const assetsDir = path.join(__dirname, '../public/assets');

// Create directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('✅ Created /public/assets/ directory');
}

console.log('🚀 Starting image download...\n');

let completed = 0;

sampleImages.forEach((image, index) => {
  const filepath = path.join(assetsDir, image.name);
  
  // Check if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`⏭️  Skipped: ${image.name} (already exists)`);
    completed++;
    if (completed === sampleImages.length) {
      printSuccess();
    }
    return;
  }
  
  console.log(`⏳ Downloading: ${image.name} (${image.description})...`);
  
  https.get(image.url, (response) => {
    if (response.statusCode === 200) {
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Downloaded: ${image.name}`);
        completed++;
        
        if (completed === sampleImages.length) {
          printSuccess();
        }
      });
      
      fileStream.on('error', (err) => {
        console.error(`❌ Error saving ${image.name}:`, err.message);
        fs.unlink(filepath, () => {});
      });
    } else {
      console.error(`❌ Failed to download ${image.name}: HTTP ${response.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`❌ Error downloading ${image.name}:`, err.message);
  });
});

function printSuccess() {
  console.log('\n🎉 All images downloaded successfully!');
  console.log('\n📁 Images saved to: /public/assets/\n');
  console.log('Next steps:');
  console.log('1. Visit http://localhost:3000/carousel-demo');
  console.log('2. Or use in your page:');
  console.log('\n```tsx');
  console.log('const images = [');
  sampleImages.forEach(img => {
    console.log(`  '/assets/${img.name}',`);
  });
  console.log('];\n');
  console.log('<HeroShatterCarousel images={images} />');
  console.log('```\n');
}







