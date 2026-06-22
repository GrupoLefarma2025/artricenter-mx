import fs from 'fs';
import path from 'path';

const distPath = './dist';

function fixPaths(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fixPaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf-8');

      // No path fixes needed - site is at root
      // Assets and links remain at /

      fs.writeFileSync(filePath, content);
      console.log(`Fixed paths in ${filePath}`);
    }
  });
}

console.log('Fixing asset and navigation paths for GitHub Pages...');
fixPaths(distPath);
console.log('Done!');
