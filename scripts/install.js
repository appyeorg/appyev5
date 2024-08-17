
const mirrors = [
  "https://raw.githubusercontent.com/appyeorg/appyev5/main/",
  "https://raw.githack.com/appyeorg/appyev5/main/",
  "https://gitea.com/Unmoral1633/Appye/raw/branch/main/",
  "https://codeberg.org/lucky/Appye/raw/branch/main/",
]

//TODO: Actually implement this
const proxies = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url="
]


async function makeFile(opfsRoot, fileName, fileType, content) {
  let currentFolder;
    if(fileName.includes("/")){
      let fileParts = fileName.split("/");
      //remove the last part
      fileName = fileParts.pop();
      currentFolder = opfsRoot;
      for(let filePart of fileParts){
        try {
          currentFolder = await currentFolder.getDirectoryHandle(filePart, { create: true });
        } catch (error) {
          console.error("Error: " + error);
        }
      }
     } else {
      currentFolder = opfsRoot;
     }

    // Get a handle to the file
     let fileHandle = await currentFolder.getFileHandle(fileName, { create: true });
  
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
    let files;
    let folders;
    let blacklist;
    let mirror;
    const processedFiles = new Set(); // Initialize a set to track processed files
  
    for (let currentMirror in mirrors) {
      try {
        console.log("Trying mirror: " + mirrors[currentMirror]);
        let filesRequest = await fetch(mirrors[currentMirror] + "files.json");
        let foldersRequest = await fetch(mirrors[currentMirror] + "folders.json");
        let blackListRequest = await fetch(mirrors[currentMirror] + "blacklist.json");
        if (filesRequest.ok && foldersRequest.ok && blackListRequest.ok) {
          console.log("Mirror found: " + mirrors[currentMirror]);
          mirror = mirrors[currentMirror];
          files = await filesRequest.json();
          folders = await foldersRequest.json();
          blacklist = await blackListRequest.json();
  
          files = files.files;
          folders = folders.folders;
          blacklist = blacklist.blacklist;
  
          break;
        }
      } catch (error) {
        console.error("Error: " + error);
      }
    }
  
    if (!files || !folders) {
      alert("No working mirrors found");
      return;
    }
  
    for (let folder of folders) {
      if (folder.includes("/")) {
        console.log("Creating folder: " + folder);
        let folderParts = folder.split("/");
        console.log("Creating folders: ", folderParts);
        let currentFolder = fs;
        console.log("Current folder: ", currentFolder);
        for (let folderPart of folderParts) {
          try {
            currentFolder = await currentFolder.getDirectoryHandle(folderPart, { create: true });
          } catch (error) {
            console.error("Error: " + error);
          }
        }
      } else {
        console.log("Creating folder: " + folder);
        try {
          await fs.getDirectoryHandle(folder, { create: true });
        } catch (error) {
          console.error("Error: " + error);
        }
      }
    }
  
    for (let file of files) {
      if (!processedFiles.has(file) && !blacklist.includes(file)) { // Check if the file has not been processed
        console.log("Downloading file: " + file);
        let content = await fetch(mirror + file);
        let contentBlob = await content.blob();
        let contentMimeType = content.headers.get("Content-Type");
        console.log("File: " + file + " MimeType: " + contentMimeType);
        try {
          await makeFile(fs, file, contentMimeType, contentBlob);
          processedFiles.add(file); // Add the file to the set of processed files
        } catch (error) {
          console.error("Error: " + error);
        }
      }
    }

    localStorage.setItem("installComplete", "true");
  }

await InitFs();
