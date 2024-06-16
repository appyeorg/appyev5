async function openApp(appID){
    const fs = await navigator.storage.getDirectory();
    let userDir = await fs.getDirectoryHandle("user");
    let appDir = await userDir.getDirectoryHandle("apps");
    let appHandle = await appDir.getDirectoryHandle(appID);
    let entryPointFileName = window.appIndex[appID].entryPoint;
    console.log("Loading entry point: " + entryPointFileName);
    let entryPointFile = await appHandle.getFileHandle(entryPointFileName, { create: false });
    entryPointFile = await entryPointFile.getFile();
    let entryPointBlob = await entryPointFile.text();
    let fileDocumentObject = document.createElement("script");
    fileDocumentObject.src = URL.createObjectURL(new Blob([entryPointBlob], { type: "application/javascript" }));
    document.head.appendChild(fileDocumentObject);
}