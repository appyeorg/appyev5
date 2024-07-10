async function installFromZip() {
    let zip = new JSZip();
    // Get the user to select a zip file
    let zipFile = await window.showOpenFilePicker({ types: [{ description: "Zip files", accept: { "application/zip": [".zip"] } }] });
    zipFile = await zipFile[0].getFile();
    // Get ZIP file name
    let zipFileName = zipFile.name;
    console.log(zipFileName);
    zipFile = await zipFile.arrayBuffer();
    zipFile = await zip.loadAsync(zipFile);
    zipFile.file("metadata.json").async("string").then((metadata) => {
      console.log(metadata);
    });
  }