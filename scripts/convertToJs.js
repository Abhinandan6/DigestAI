import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Files to ignore during conversion
const ignoreFiles = [
  'node_modules',
  'dist',
  '.git',
  '.vscode',
  'convertToJs.js'
];

// Function to check if a file should be processed
const shouldProcessFile = (filePath) => {
  return !ignoreFiles.some(ignore => filePath.includes(ignore));
};

// Function to convert TypeScript files to JavaScript
async function convertTsToJs(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (!shouldProcessFile(fullPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await convertTsToJs(fullPath);
      } else {
        // Process TypeScript files
        if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          console.log(`Converting: ${fullPath}`);
          
          // Read the file content
          let content = await fs.readFile(fullPath, 'utf8');
          
          // Remove TypeScript specific syntax
          content = content
            // Remove import type statements
            .replace(/import\s+type\s+.*?from\s+['"].*?['"]/g, '')
            // Remove interface declarations
            .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '')
            // Remove type declarations
            .replace(/type\s+\w+\s*=[\s\S]*?;/g, '')
            // Remove type annotations
            .replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*\s*(?=[,)=;])/g, '')
            // Remove generic type parameters
            .replace(/<[\s\S]*?>/g, '')
            // Fix import extensions
            .replace(/from\s+['"](.+?)\.tsx?['"]/g, (match, p1) => `from '${p1}.jsx'`)
            // Remove export type statements
            .replace(/export\s+type\s+.*?;/g, '');
          
          // Determine the new file extension
          const newExt = entry.name.endsWith('.tsx') ? '.jsx' : '.js';
          const newPath = fullPath.replace(/\.tsx?$/, newExt);
          
          // Write the converted content
          await fs.writeFile(newPath, content, 'utf8');
          
          // Delete the original TypeScript file
          await fs.unlink(fullPath);
        }
        
        // Update imports in JavaScript files
        if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
          let content = await fs.readFile(fullPath, 'utf8');
          
          // Update import statements to use .js/.jsx extensions
          content = content.replace(/from\s+['"](.+?)['"](?!\s*;)/g, (match, p1) => {
            // Skip node modules and relative paths that already have extensions
            if (p1.startsWith('./') || p1.startsWith('../')) {
              if (!p1.endsWith('.js') && !p1.endsWith('.jsx') && !p1.endsWith('.css') && !p1.endsWith('.json')) {
                return `from '${p1}.js'`;
              }
            }
            return match;
          });
          
          await fs.writeFile(fullPath, content, 'utf8');
        }
      }
    }
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

// Function to update package.json
async function updatePackageJson() {
  try {
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    
    // Update scripts to remove TypeScript
    if (packageJson.scripts) {
      packageJson.scripts.build = 'vite build';
      // Remove TypeScript related scripts
      delete packageJson.scripts['tsc'];
      delete packageJson.scripts['type-check'];
    }
    
    // Remove TypeScript dependencies
    if (packageJson.devDependencies) {
      const tsPackages = [
        'typescript',
        'typescript-eslint',
        '@types/react',
        '@types/react-dom',
        '@types/node'
      ];
      
      tsPackages.forEach(pkg => {
        delete packageJson.devDependencies[pkg];
      });
    }
    
    // Write updated package.json
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log('Updated package.json');
  } catch (error) {
    console.error('Error updating package.json:', error);
  }
}

// Function to remove TypeScript config files
async function removeTypeScriptConfigs() {
  try {
    const tsConfigs = [
      'tsconfig.json',
      'tsconfig.node.json',
      'tsconfig.app.json',
      'src/vite-env.d.ts',
      'src/types/nhost.d.ts',
      'src/env.d.ts'
    ];
    
    for (const config of tsConfigs) {
      const configPath = path.join(rootDir, config);
      try {
        await fs.access(configPath);
        await fs.unlink(configPath);
        console.log(`Removed: ${configPath}`);
      } catch (err) {
        // File doesn't exist, skip
      }
    }
  } catch (error) {
    console.error('Error removing TypeScript configs:', error);
  }
}

// Main function to run the conversion
async function main() {
  console.log('Starting TypeScript to JavaScript conversion...');
  
  // Step 1: Convert TS files to JS
  await convertTsToJs(rootDir);
  
  // Step 2: Update package.json
  await updatePackageJson();
  
  // Step 3: Remove TypeScript config files
  await removeTypeScriptConfigs();
  
  // Step 4: Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
  
  console.log('Conversion completed successfully!');
}

main().catch(console.error);