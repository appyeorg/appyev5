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