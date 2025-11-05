// Simple icon generator for PWA
// This creates placeholder icons. For production, use a proper icon generator or design tool.

const fs = require('fs')
const path = require('path')

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const publicDir = path.join(__dirname, '../public')

// Create SVG icon (simple Z logo)
const createSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="55%" text-anchor="middle" font-size="${size * 0.6}" font-family="Arial, sans-serif" font-weight="bold" fill="#FFFFFF">Z</text>
</svg>
`.trim()

console.log('📱 Generating PWA icons...\n')

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`
  const filepath = path.join(publicDir, filename)
  
  // For this simple example, we'll create SVG files
  // In production, you'd convert these to PNG using a library like sharp
  const svgContent = createSVG(size)
  const svgFilepath = filepath.replace('.png', '.svg')
  
  fs.writeFileSync(svgFilepath, svgContent)
  console.log(`✅ Created ${filename.replace('.png', '.svg')}`)
})

// Create a simple HTML file that shows how to convert SVGs to PNGs
const conversionGuide = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Convert Icons to PNG</title>
  <style>
    body { font-family: Arial; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; }
    .icon { margin: 20px; padding: 20px; border: 2px solid #ddd; border-radius: 8px; }
    canvas { border: 1px solid #ccc; margin: 10px; }
    button { background: #000; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #333; }
  </style>
</head>
<body>
  <h1>🎨 Icon Generator - Convert to PNG</h1>
  <p>The SVG icons have been created. Use this page to convert them to PNG, or use an online tool like:</p>
  <ul>
    <li><a href="https://realfavicongenerator.net/" target="_blank">RealFaviconGenerator</a></li>
    <li><a href="https://www.favicon-generator.org/" target="_blank">Favicon Generator</a></li>
    <li><a href="https://favicon.io/" target="_blank">Favicon.io</a></li>
  </ul>
  
  <h2>Or use ImageMagick (command line):</h2>
  <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto;">
${sizes.map(size => `convert icon-${size}x${size}.svg icon-${size}x${size}.png`).join('\n')}
  </pre>

  <h2>Quick PNG Generation (Browser):</h2>
  ${sizes.map(size => `
  <div class="icon">
    <h3>Icon ${size}x${size}</h3>
    <canvas id="canvas-${size}" width="${size}" height="${size}"></canvas>
    <br>
    <button onclick="downloadIcon(${size})">Download PNG</button>
  </div>
  `).join('')}

  <script>
    const sizes = [${sizes.join(', ')}];
    
    // Draw icons on canvas
    sizes.forEach(size => {
      const canvas = document.getElementById('canvas-' + size);
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);
      
      // Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold ' + (size * 0.6) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Z', size / 2, size / 2);
    });
    
    function downloadIcon(size) {
      const canvas = document.getElementById('canvas-' + size);
      const link = document.createElement('a');
      link.download = 'icon-' + size + 'x' + size + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  </script>
</body>
</html>
`

fs.writeFileSync(path.join(publicDir, 'generate-icons.html'), conversionGuide)
console.log('\n✅ Created icon conversion guide: public/generate-icons.html')
console.log('\n📝 To generate PNG icons:')
console.log('   1. Open public/generate-icons.html in your browser')
console.log('   2. Click "Download PNG" for each icon size')
console.log('   3. Or use an online tool or ImageMagick\n')

