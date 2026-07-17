const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src/styles');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let inventory = [];

walkDir(stylesDir, function(filePath) {
  if (filePath.endsWith('.css')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const size = fs.statSync(filePath).size;
    const lines = content.split('\n').length;
    
    // Rough estimates using regex
    const selectors = (content.match(/[^{}]+(?=\{)/g) || []).length;
    const mediaQueries = (content.match(/@media/g) || []).length;
    const variablesUsed = (content.match(/var\(--[a-zA-Z0-9-]+\)/g) || []).length;
    
    inventory.push({
      file: filePath.replace(stylesDir, ''),
      size: (size / 1024).toFixed(2) + ' KB',
      lines,
      selectors,
      mediaQueries,
      variablesUsed
    });
  }
});

console.log(JSON.stringify(inventory, null, 2));
