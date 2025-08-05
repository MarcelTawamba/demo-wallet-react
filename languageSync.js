// ******* Important Note *******
// This script is responsible to generate wallet language JSON file.
// The script will merge and generate both web wallet and mobile wallet's combined JSON file.
// To generate combined JSON, make sure the web and mobile wallet repositories remain in the same directory.
// After successful JSON file generation, the language.json file can be found in public folder of this repo.
// The JSON file will be served in http://localhost:3000/language-en.json URL.
// The JSON file can be downloaded by serving http://localhost:3000/download-en-json/
// Command: `node languageSync.js` or `yarn language-sync`

const path = require('path');
const fs = require('fs');

let finalJsonData = {};

async function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log('no dir ->', startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
      fromDir(filePath, filter); //recurse the folder
    } else if (filePath.endsWith(filter)) {
      // Extract the module name from the path
      // We want to extract the module name (like 'common', 'accounts', etc.)
      // instead of the full path
      
      // Get the relative path from the start path
      const relativePath = path.relative(startPath, filePath);
      const pathParts = relativePath.split(path.sep);
      
      // Extract the module name - use the directory name if it's in a 'locales' directory
      // or use the filename (without extension) otherwise
      let moduleName;
      
      // Check if the file is in a 'locales' or similar directory
      const localesIndex = pathParts.findIndex(part => 
        part.toLowerCase() === 'locales' || 
        part.toLowerCase() === 'locale' || 
        part.toLowerCase() === 'i18n'
      );
      
      if (localesIndex !== -1 && localesIndex < pathParts.length - 1) {
        // If in a locales directory, use the next directory/file name as the module name
        moduleName = pathParts[localesIndex + 1].split('.')[0];
      } else {
        // Otherwise just use the filename without extension
        const fileName = pathParts[pathParts.length - 1];
        moduleName = fileName.split('.')[0];
      }
      
      // Handle files with underscores (convert to camelCase)
      const keyArray = moduleName.split('_');
      if (keyArray.length > 1) {
        moduleName = '';
        for (let index = 0; index < keyArray.length; index++) {
          moduleName +=
            index === 0
              ? keyArray[index]
              : keyArray[index].charAt(0).toUpperCase() +
                keyArray[index].substring(1);
        }
      }
      
      // Read and parse the JSON file
      let rawData = fs.readFileSync(filePath);
      finalJsonData[moduleName] = JSON.parse(rawData);
    }
  }
  return finalJsonData;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target, ...sources) {
  // target keys value will be replaced by sources keys
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

// Main execution
console.log('Starting language sync process...');

fromDir('./src', '.en.json')
  .then(webJson => {
    console.log('Web wallet language files processed.');
    finalJsonData = {};
    fromDir('../wallet-react-native/src', '.en.json')
      .then(mobileJson => {
        console.log('Mobile wallet language files processed.');
        const jsonData = mergeDeep(mobileJson, webJson);
        fs.writeFileSync('./public/language-en.json', JSON.stringify(jsonData, null, 2));
        console.log('---Completed: language-en.json has been generated in the public folder---');
      })
      .catch(error => console.log('ERROR IN MOBILE WALLET ->', error));
  })
  .catch(error => console.log('ERROR IN WEB WALLET ->', error));
