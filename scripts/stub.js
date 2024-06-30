//This file is a stub, which launches Appye on the page. It must be ran by an extension, userscript, bookmarklet,
// or any other method of running JavaScript on a page.

// The config variable needs to be defined before the function is called.
let config;
async function loadResources() {
    //Get OPFS root, ya'know so we can actually get files.
    const fs = await navigator.storage.getDirectory();
    let configDir,depsDir;
    try {
        configDir = await fs.getDirectoryHandle("config");
        userDir = await fs.getDirectoryHandle("user");
        systemDir = await userDir.getDirectoryHandle("system");
        depsDir = await systemDir.getDirectoryHandle("dependencies");
    } catch(e){
        console.error(`ERROR: Could not locate required directories. Please ensure that Appye is installed correctly.`);
        return;
    }

    try {
        let configFile = await configDir.getFileHandle("config.json", { create: false });
        configFile = await configFile.getFile();
        configFile = await configFile.text();
        config = JSON.parse(configFile);
    } catch(e){
        console.error(`ERROR: Could not load config file. Please ensure that Appye is installed correctly.`);
        return;
    }
    
    for(let file of config.included_Dependencies){
        let fileBlob;
        try {
            let fileObject = await depsDir.getFileHandle(file, { create: false });
            let fileFile = await fileObject.getFile();
            fileBlob = await fileFile.text();
        } catch(e){
            console.log(`WARNING: Could not load dependency ${file}. This may cause Appye to be unstable.`);
        }

        if(file.endsWith(".js")){
            let fileDocumentObject = document.createElement("script");
            fileDocumentObject.src = URL.createObjectURL(new Blob([fileBlob], { type: "application/javascript" }));
            document.head.appendChild(fileDocumentObject);
        } else if(file.endsWith(".css")){
            let fileDocumentObject = document.createElement("style");
            fileDocumentObject.textContent = fileBlob;
            document.head.appendChild(fileDocumentObject);
        }
    }
}

await loadResources();
// Wait a bit for the resources to load
await new Promise(resolve => setTimeout(resolve, 1000));
await updateAppIndex();
// Wait a bit for the app index to be updated
await new Promise(resolve => setTimeout(resolve, 1000));
//Now, as a test, print window.appIndex to the console.
console.log(window.appIndex);

//Let's start the apps that requested to be started.
if(config.auto_Start_Apps){
    for(let app in config.auto_Start_Apps){
        if(window.appIndex[app]){
            console.log(`Starting ${app}...`);
            openApp(app);
        } else {
            console.error(`ERROR: Could not start ${app}. App not found.`);
        }
    }
} else {
    console.log(`WARNING: No apps are set to auto-start.`);
}