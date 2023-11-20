const TypeDoc = require("typedoc");
const fs = require('fs');
const path = require('path');

const functionsDocConfig = require("./functionsdoc.config.js");
const classesDocsConfig = require("./classesdoc.config.js");


async function run() {
  await generateDocs(classesDocsConfig);
  postProcessClassesDocs(classesDocsConfig);

  await generateDocs(functionsDocConfig);
  postProcessFunctionsDocs(functionsDocConfig);

  if (fs.existsSync(classesDocsConfig.out + "/modules.md")) {
    fs.unlinkSync(classesDocsConfig.out + "/modules.md");
  }
}

run().catch(console.log);

///// Post process docs 
function postProcessClassesDocs(configOptions) {

  const packagesPath = configOptions.out + '/classes/';

  copyDir(packagesPath, configOptions.out);
  cleanDir(packagesPath);

  try {
    const files = fs.readdirSync(configOptions.out);
    files.forEach(function (file) {
      const filePath = path.join(configOptions.out, file);
      const data = fs.readFileSync(filePath, 'utf8');
      const replacedData = data.replace(/\.md/g, '');
      fs.writeFileSync(filePath, replacedData, 'utf8');
    });
  } catch (err) {
    console.log('Error getting directory information.');
  }

}

function postProcessFunctionsDocs(configOptions) {

  const packagesPath = configOptions.out + '/modules/';
  //post process functions

  copyDir(packagesPath, configOptions.out);
  cleanDir(packagesPath);

  removeFile("./docs/docs/libdocs/README.md");

}

///// utils
async function generateDocs(config) {
  const app = await TypeDoc.Application.bootstrapWithPlugins(config);

  const project = await app.convert();

  if (project) {
    await app.generateDocs(project, config.out);
  }
}

function removeFile(filePath){
  const stats = fs.statSync(filePath);
  if (stats.isFile()) {
    // If it's a file, delete it
    fs.unlinkSync(filePath);
  }
}

function copyDir(src, dest) {
  // Create the destination folder if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  // Read the source directory
  const files = fs.readdirSync(src);

  // Loop through all the files in the source directory
  for (let file of files) {
    // Get the full path of the file
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    // Get the file's stats
    const stats = fs.statSync(srcPath);

    // If the file is a directory, recursively copy it
    if (stats.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // If the file is a file, copy it
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function cleanDir(dirPath) {
  // Check if the directory exists
  if (fs.existsSync(dirPath)) {
    // Get all the files and subdirectories in the directory
    const files = fs.readdirSync(dirPath);

    // Loop through all the files and subdirectories
    for (let file of files) {
      // Get the full path of the file or subdirectory
      const filePath = path.join(dirPath, file);

      // Check if it's a file or a subdirectory
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        // If it's a file, delete it
        fs.unlinkSync(filePath);
      } else {
        // If it's a subdirectory, recursively delete it
        cleanDir(filePath);
      }
    }

    // Finally, delete the directory itself
    fs.rmdirSync(dirPath);
  }
}

