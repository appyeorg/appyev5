async function installFromZip() {
  let zip = new JSZip();
  // Get the user to select a zip file
  let zipFile = await showOpenFilePicker({ types: [{ description: "Zip files", accept: { "application/zip": [".zip"] } }] });
  zipFile = await zipFile[0].getFile();
  // Get ZIP file name
  let zipFileName = zipFile.name.replace(".zip", "");
  console.log("INFO: ZIP ID is " + zipFileName);
  zip = await zip.loadAsync(zipFile); // Corrected variable assignment
  let metadataFile = zip.file("metadata.json");
  let metadata;
  try {
    metadata = await metadataFile.async("string");
    metadata = JSON.parse(metadata); // Moved inside try to ensure metadata is defined before parsing
  } catch (e) {
    console.log("ERROR: This ZIP might not have metadata included. " + e);
    return; // Added return to stop execution if metadata is not found
  }
  
  if (!metadata.id || !metadata.entryPoint) {
    console.log("ERROR: This ZIP does not have the required metadata.");
    return;
  } else {
    console.log("INFO: Metadata is valid. Proceeding with installation.");
    let installationPath = await window.parent.directory.apps.global.getDirectoryHandle(metadata.id, { create: true });
    // Install files recursively from the ZIP

    // First get all the folders
    let folders = Object.values(zip.files).filter(file => file.dir);
    if (!folders.length) {
      console.log("WARNING: No folders found in the ZIP.");
    } else {
      console.log("INFO: Folders found: ", folders);
      // Iterate through the folders
      for (let folder of folders) {
        let folderName = folder.name;
        // If folder has more than one "/" in the name, it is a subfolder
        if (folderName.split("/").length > 1) {
          console.log("INFO: Found subfolder: " + folderName);
          // Create the subfolder, assuming the parent folder exists
          // To do this, first split the folder name by the separator
          let folderParts = folderName.split("/").filter(part => part.length > 0);

          // Then, iterate through the parts
          let currentFolder = installationPath;
          for (let folderPart of folderParts) {
            try {
              currentFolder = await currentFolder.getDirectoryHandle(folderPart, { create: true });
            } catch (error) {
              console.error("ERROR: " + error);
              return; // Added return to stop execution on error
            }
          }
        } else {
          console.log("INFO: Found folder: " + folderName);
          // Create the folder
          try {
            await installationPath.getDirectoryHandle(folderName, { create: true });
          } catch (error) {
            console.error("ERROR: " + error);
            return; // Added return to stop execution on error
          }
        }
      }

      //Now we are done with the folders, let's install the files
      let fs = await navigator.storage.getDirectory();
      let files = Object.values(zip.files).filter(file => !file.dir);
      console.log("INFO: Files found: ", files);
      for (let file of files) {
        let filePath = file.name;
        //await makeFile(fs, file, contentMimeType, contentBlob);
        let content = await file.async("blob");
        let contentMimeType = await content.type;
        console.log("INFO: File: " + filePath + " MimeType: " + contentMimeType);
        try {
          await window.parent.makeFile(installationPath, filePath, contentMimeType, content);
        } catch (error) {
          console.error("ERROR: Unable to create file " + error);
          return; 
      }
    }
    alert("Installation complete.");
  }
}
}
