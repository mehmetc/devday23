/*
  KULeuven/LIBIS (c) 2022
  Mehmet Celik mehmet(dot)celik(at)kuleuven(dot)be
*/
const AdmZip = require('adm-zip');
const FS = require('fs-extra');
const glob = require('glob');

const Package = require('./package.json');

function removePackage(resource) {
    let packageDir = Package.primo.build.package;
    let packagePath = `${packageDir}/${resource}.zip`;

    try {
        FS.removeSync(packagePath);
        console.log(`\tPreviously created package removed. (${packagePath})`);
    } catch (error) {
        console.log(error);
        console.log("\tPreviously created package not found.");
    }
}

function createTmpDir(resource) {
    let tmp = Package.primo.build.tmp;
    let tmpPackageDir = `./${tmp}/${resource}`;
    try {
        FS.removeSync(tmpPackageDir);
        console.log("\tPrevious Tmp package dir removed");
    } catch (err) {
        console.log("\tPrevious Tmp package not found");
    }

    try {
        FS.ensureDirSync(`${tmpPackageDir}`);
        console.log("\tTmp package dir created");
    } catch (err) {
        console.log("\tUnable to create Tmp package dir ");
    }
}

function copyResources(resource) {
    let resourceDir = Package.primo.build.resources;
    let distDir = Package.primo.build.dist;
    try {
        console.log("\tCopying resources");
        ['general', resource].forEach(dir => {
            let files = glob.sync(`${resourceDir}/${dir}`);
                files.forEach(file => {                    
                    FS.copySync(file, `tmpPackage/${resource}/`, { overwrite: true })
                })            
        });

        let files = glob.sync(`${distDir}/*/`);
            files.forEach(file => {                    
                FS.copySync(file, `tmpPackage/${resource}/`, { overwrite: true })
            });                
    } catch (err) {
        console.error(err);
    }
}

function createArchive(resource) {
    let zip = new AdmZip();
    let tmp = Package.primo.build.tmp;
    console.log("\tCreating archive");
    zip.addLocalFolder(`${tmp}/${resource}`, resource); 
       
    zip.writeZip(`package/${resource}.zip`);
}

function removeTmpDir(resource) {
    let tmp = Package.primo.build.tmp;
    FS.removeSync(tmp);    
}

function setup(resource) {
    console.log(`Packaging ${resource}`)
    removePackage(resource);
    createTmpDir(resource);
    copyResources(resource);  
    createArchive(resource);  
    removeTmpDir(resource);
}

const institution = Package.primo.institution;
for (const view of Package.primo.build.views) {
    let resource = `${institution}-${view}`;
    setup(resource);
}