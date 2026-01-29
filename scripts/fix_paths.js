import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all .html files
function findHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else {
            if (path.extname(file) === '.html') {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

const distDir = path.join(__dirname, '../dist/client');
const htmlFiles = findHtmlFiles(distDir);

console.log(`Checking ${htmlFiles.length} HTML files for path corrections...`);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Calculate relative prefix from this file to the district root
    // e.g., 'dist/client/artists/index.html' -> '../'
    // e.g., 'dist/client/index.html' -> ''
    const relativePathToRoot = path.relative(path.dirname(file), distDir).replace(/\\/g, '/');

    // Prefix is just the traversal up (../) or current (./)
    // We DO NOT add 'client/' here because .htaccess rewrites virtual root paths to physical client paths
    const prefix = relativePathToRoot ? relativePathToRoot + '/' : './';

    // Helper to make a path relative
    // Cleans up any existing prefixes like /client/, ./client/, /_astro/ etc.
    const makeRelative = (match, attribute, pathContent) => {
        return `${attribute}="${prefix}${pathContent}`;
    };

    // 1. Fix Astro Assets (_astro)
    // Matches: /_astro/, /client/_astro/, ./client/_astro/, ../client/_astro/
    content = content.replace(/(src|href)=".*?_astro\/(.*?)"/g, (match, attr, path) => makeRelative(match, attr, '_astro/' + path + '"'));

    // 2. Fix Static Assets (fonts, images)
    content = content.replace(/(src|href)=".*?assets\/(.*?)"/g, (match, attr, path) => makeRelative(match, attr, 'assets/' + path + '"'));
    content = content.replace(/(src|href)=".*?fonts\/(.*?)"/g, (match, attr, path) => makeRelative(match, attr, 'fonts/' + path + '"'));
    content = content.replace(/(src|href)=".*?artists\/(.*?)"/g, (match, attr, path) => makeRelative(match, attr, 'artists/' + path + '"'));

    // 3. Fix Specific Public Roots
    const specificFiles = [
        'logo.svg', 'favicon.svg', 'favicon.ico', 'site.webmanifest', 'robots.txt', 'og-image.png'
    ];

    specificFiles.forEach(filename => {
        // Matches any path ending in the filename
        const regex = new RegExp(`(src|href|content)=".*?${filename.replace('.', '\\.')}"`, 'g');
        content = content.replace(regex, (match, attr) => `${attr}="${prefix}${filename}"`);
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        // console.log(`✅ Fixed paths in: ${path.relative(distDir, file)}`); 
    }
});

console.log('Path correction complete.');
