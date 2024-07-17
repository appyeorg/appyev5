async function makeFile(opfsRoot, fileName, fileType, content) {
  let currentFolder;
  try {
      if (fileName.includes("/")) {
          let fileParts = fileName.split("/");
          // Remove the last part
          fileName = fileParts.pop();
          currentFolder = opfsRoot;
          for (let filePart of fileParts) {
              try {
                  currentFolder = await currentFolder.getDirectoryHandle(filePart, { create: true });
              } catch (error) {
                  console.error("ERROR: Could not get dorectory handle. " + error);
              }
          }
      } else {
          currentFolder = opfsRoot;
      }

      // Get a handle to the file
      let fileHandle;
      try {
          fileHandle = await currentFolder.getFileHandle(fileName, { create: true });
      } catch (error) {
          console.error("ERROR: Could not get file handle. " + error);
          return; // Exit if we can't get a file handle
      }

      // Get a writable stream
      let writable;
      try {
          writable = await fileHandle.createWritable();
      } catch (error) {
          console.error("ERROR: Could not create writeable stream. " + error);
          return; // Exit if we can't create a writable stream
      }

      // Write to the file
      try {
          if (content instanceof Blob) {
              await writable.write(content);
          } else {
              await writable.write(new Blob([content], { type: fileType }));
          }
      } catch (error) {
          console.error("ERROR: Could not write to file: " + error);
      } finally {
          // Always attempt to close the writable stream
          try {
              await writable.close();
          } catch (error) {
              console.error("ERROR: Could not close writable stream: " + error);
          }
      }

      // Return the file handle
      return fileHandle;
  } catch (error) {
      console.error("Unexpected error: " + error);
  }
}