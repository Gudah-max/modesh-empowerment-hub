const fs = require('fs');

const files = fs.readdirSync('./public/images').filter(f => !f.includes('logo'));
const categories = ['In the Kitchen', 'Masterpieces', 'Graduation'];

let output = "  const galleryItems = [\n";
files.forEach((file, index) => {
  const cat = categories[index % 3];
  output += `    { src: '/images/${file}', category: '${cat}' },\n`;
});
output += "  ];\n";

fs.writeFileSync('./gallery_items.txt', output);
console.log('Done');
