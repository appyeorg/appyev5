async function updateAppIndex(){
  try {
    const fs = await navigator.storage.getDirectory();
    let userDir = await fs.getDirectoryHandle("user");
    let appDir = await userDir.getDirectoryHandle("apps");

    let appList = appDir.values();
    window.appIndex = {};
    for await (let currentAppDir of appList){
      try {
        if (currentAppDir.kind = 'directory'){
          console.log("Indexed app " + currentAppDir.name)
          // Get the app's directory
          let currentAppDirHandle = await appDir.getDirectoryHandle(currentAppDir.name);
          // Get the app's metadata.json
          let metadataFile = await currentAppDirHandle.getFileHandle("metadata.json", { create: false });
          let metadata = await metadataFile.getFile();
          window.appIndex[currentAppDir.name] = JSON.parse(await metadata.text());
          window.directory.apps[currentAppDir.name] = currentAppDirHandle;
        }
      } catch (innerError) {
        console.error(`ERROR: App may not be installed correctly. ${currentAppDir.name}:`, innerError);
      }
    }
  } catch (error) {
    console.error("ERROR: Failed to update index", error);
  }
}