const fs = require('fs');
const path = require('path');
function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = content.replace(/\\`/g, '`');
  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed);
    console.log('Fixed', filePath);
  }
}
replaceInFile('c:/Users/Gaurav Pehlajani/Downloads/Hex- (1)/Hex-/src/pages/Academy.tsx');
const dir = 'c:/Users/Gaurav Pehlajani/Downloads/Hex- (1)/Hex-/src/components/academy';
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx')) {
    replaceInFile(path.join(dir, file));
  }
});
