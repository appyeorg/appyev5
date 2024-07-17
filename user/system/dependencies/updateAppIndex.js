async function updateAppIndex(){
  try {
    let appDir = window.directory.apps.global;

    let appList = appDir.values();
    window.appIndex = {};
    for await (let currentAppDir of appList){
      try {
        if (currentAppDir.kind = 'directory'){
          if(currentAppDir.name == "global") {
            continue;
          }
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

  try {
    let configFile = await window.directory.config.getFileHandle("config.json", { create: false });
    configFile = await configFile.getFile();
    configFile = await configFile.text();
    config = JSON.parse(configFile);
    window.configText = config;
  } catch(e){
    console.error(`ERROR: Could not load config file. Please ensure that Appye is installed correctly.`);
    return;
  }
}