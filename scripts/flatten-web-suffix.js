const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      return;
    }
    if (/\.native\.(js|d\.ts)$/.test(entry.name)) {
      fs.unlinkSync(fullPath);
      return;
    }
    const match = entry.name.match(/^(.*)\.web\.(js|d\.ts)$/);
    if (!match) {
      return;
    }
    const destination = path.join(dir, `${match[1]}.${match[2]}`);
    fs.renameSync(fullPath, destination);
  });
};

walk(path.join(__dirname, '..', 'dist'));
