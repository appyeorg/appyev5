async function updateAppIndex(){
  const fs = await navigator.storage.getDirectory();
  let userDir = await fs.getDirectoryHandle("user");
  let appDir = await userDir.getDirectoryHandle("apps");

  let appList = appDir.values();
  for await (let currentAppDir of appList){
    if (currentAppDir.kind = 'directory'){
      console.log("Indexed app " + currentAppDir.name)
    }
  }
}
