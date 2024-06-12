async function makeFile(opfsRoot, fileName, fileType, content) {
    // Get a handle to the file
     let fileHandle = await opfsRoot.getFileHandle(fileName, { create: true });
  
    // Get a writable stream
    let writable = await fileHandle.createWritable();
  
    // Write the content to the file
    await writable.write(new Blob([content], { type: fileType }));
  
    // Close the writable stream
    await writable.close();
  
    // Return the file handle
    return fileHandle;
  }

async function InitFs() {
    const fs = await navigator.storage.getDirectory();
    //Find a mirror.
  }