async function openApp(appID){
    try {
        let appHandle = window.directory.apps[appID];
        let entryPointFileName = window.appIndex[appID].entryPoint;
        console.log("Loading entry point: " + entryPointFileName);
        let entryPointFile = await appHandle.getFileHandle(entryPointFileName, { create: false });
        entryPointFile = await entryPointFile.getFile();
        let entryPointBlob = await entryPointFile.text();
        let fileDocumentObject = document.createElement("script");
        fileDocumentObject.src = URL.createObjectURL(new Blob([entryPointBlob], { type: "application/javascript" }));
        document.head.appendChild(fileDocumentObject);
    } catch (error) {
        console.log("ERROR: Failed to open app with ID " + appID + ": ", error);
    }
}