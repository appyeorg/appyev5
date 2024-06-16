//This file is a stub, which launches Appye on the page. It must be ran by an extension, userscript, bookmarklet,
// or any other method of running JavaScript on a page. 

async function loadResources() {
    //Get OPFS root, ya'know so we can actually get files.
    const fs = await navigator.storage.getDirectory();
    let userDir = await fs.getDirectoryHandle("user");
    let systemDir = await userDir.getDirectoryHandle("system");
    let depsDir = await systemDir.getDirectoryHandle("dependencies");
    
    //TODO: Replace toLoad with a loop that gets all files in the dependencies directory.
    let toLoad = ["winbox.js", "makeFile.js", "updateAppIndex.js", "openApp.js", "appye.css"];

    for(let file of toLoad){
        let fileObject = await depsDir.getFileHandle(file, { create: false });
        let fileFile = await fileObject.getFile();
        let fileBlob = await fileFile.text();
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