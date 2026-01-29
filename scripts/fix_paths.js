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

    // 1. Fix Astro Assets (_astro)
    // Replaces: src="/_astro/..." with src="/client/_astro/..."
    // Replaces: href="/_astro/..." with href="/client/_astro/..."
    content = content.replace(/(src|href)="\/_astro\//g, '$1="/client/_astro/');

    // 2. Fix Static Assets (fonts, images in assets folder if any)
    content = content.replace(/(src|href)="\/assets\//g, '$1="/client/assets/');
    content = content.replace(/(src|href)="\/fonts\//g, '$1="/client/fonts/');

    // 3. Fix Specific Public Roots (logo, favicon, etc.)
    // Only replace if they are root-relative calls
    content = content.replace(/src="\/logo\.svg"/g, 'src="/client/logo.svg"');
    content = content.replace(/href="\/favicon\.svg"/g, 'href="/client/favicon.svg"');
    content = content.replace(/href="\/favicon\.ico"/g, 'href="/client/favicon.ico"');
    content = content.replace(/href="\/site\.webmanifest"/g, 'href="/client/site.webmanifest"');
    content = content.replace(/content="\/og-image\.png"/g, 'content="/client/og-image.png"');
    content = content.replace(/src="\/artists\//g, 'src="/client/artists/'); // Artist images

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Fixed paths in: ${path.relative(distDir, file)}`);
    }
});

console.log('Path correction complete.');
