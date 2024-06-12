
const mirrors = [
  "https://git.basicfan.eu.org/KUKHUA/Appye/raw/branch/main/",
  "https://raw.githubusercontent.com/appyeorg/appyev5/main/",
  "https://raw.githack.com/appyeorg/appyev5/main/",
  "https://gitea.com/Unmoral1633/Appye/raw/branch/main/",
  "https://codeberg.org/lucky/Appye/raw/branch/main/",
]

const proxies = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url="
]


async function makeFile(opfsRoot, fileName, fileType, content) {
    // Get a handle to the file
     let fileHandle = await opfsRoot.getFileHandle(fileName, { create: true });
  
    // Get a writable stream
    let writable = await fileHandle.createWritable();
  
    // check if it is alreadly a blob
    if(content instanceof Blob){
      await writable.write(content);
    } else {
      await writable.write(new Blob([content], { type: fileType }));
    }
  
    // Close the writable stream
    await writable.close();
  
    // Return the file handle
    return fileHandle;
  }

  async function InitFs() {
    const fs = await navigator.storage.getDirectory();
    // We need to get a working mirror
    let files;
    let folders;
    let mirror;
    for (let currentMirror in mirrors){
      try {
        console.log("Trying mirror: " + mirrors[currentMirror]);
        let filesRequest = await fetch(mirrors[currentMirror] + "files.json");
        let foldersRequest = await fetch(mirrors[currentMirror] + "folders.json");
        if(filesRequest.ok && foldersRequest.ok){
          console.log("Mirror found: " + mirrors[currentMirror]);
          mirror = mirrors[currentMirror];
          files = await filesRequest.json();
          folders = await foldersRequest.json();

          //I don't feel like changing my shell script, this will do.
          files = files.files;
          folders = folders.folders;

          break;
        }
      } catch (error) {
        console.error("Error: " + error);
      }
    }

    if(!files || !folders){
      alert("No working mirrors found");
      return;
    }

    for(let folder of folders){
      if(folder.includes("/")){
        console.log("Creating folder: " + folder);
        let folderParts = folder.split("/");
        console.log("Creating folders: ",folderParts);
        let currentFolder = fs;
        console.log("Current folder: ", currentFolder);
        for(let folderPart in folderParts){
          try {
            if (!(await currentFolder.queryPermission({ mode: 'readwrite' }))) {
              currentFolder = await currentFolder.getDirectoryHandle(folderPart, { create: true });
            }
          } catch (error) {
            console.error("Error: " + error);
          }
        }
      } else {
        console.log("Creating folder: " + folder);
       try {
        if (!(await fs.queryPermission({ mode: 'readwrite' }))) {
          await fs.getDirectoryHandle(folder, { create: true });
        }
       } catch (error) {
         console.error("Error: " + error);
      }
    }

    for(let file of files){
      console.log("Downloading file: " + file);
      let content = await fetch(mirror + file);
      let contentBlob = await content.blob();
      let contnetMimeType = content.headers.get("Content-Type");
      console.log("File: " + file + " MimeType: " + contnetMimeType);
      try {
        if (!(await fs.queryPermission({ mode: 'readwrite' }))) {
          makeFile(fs, file, contnetMimeType, contentBlob);
        }
      } catch (error) {
        console.error("Error: " + error);
      }
    }
  }
}