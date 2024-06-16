async function openApp(appID){
    const fs = await navigator.storage.getDirectory();
    let userDir = await fs.getDirectoryHandle("user");
    let appDir = await userDir.getDirectoryHandle("apps");
    let entryPointBlob;
    try {
        let appHandle = await appDir.getDirectoryHandle(appID);
        let entryPointFileName = window.appIndex[appID].entryPoint;
        let entryPointFile = await appHandle.getFileHandle(entryPointFileName, { create: false });
        entryPointFile = await entryPointFile.getFile();
        entryPointBlob = await entryPointFile.text();
    } catch(e){
        console.log(e);
    }
    let fileDocumentObject = document.createElement("script");
    fileDocumentObject.src = URL.createObjectURL(new Blob([entryPointBlob], { type: "application/javascript" }));
    document.head.appendChild(fileDocumentObject);
}