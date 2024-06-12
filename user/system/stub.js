//This file is a stub, which launches Appye on the page. It must be ran by an exstenion, userscript, bookmarklet,
// or any other method of running JavaScript on a page. 

//Get OPFS root, ya'know so we can actually get files.
async function loadAppye() {
    const fs = await navigator.storage.getDirectory();
    //Load /user/system/deps/winbox.js into current document.
    let winboxFileObject = fs.getFileHandle("user/system/deps/winbox.js", { create: false })
    winboxFileObject.getFile().then(file => {
    document.createElement("script").src = URL.createObjectURL(file);
    })

    //Lets open up a test window.
    let winbox = new WinBox("Test Window", {
        root: document.body,
        x: "center",
        y: "center",
        width: "50%",
        height: "50%",
        onclose: function() {
            console.log("Window closed");
        }
    });
}