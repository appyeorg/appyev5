async function pipWindow(url,html,winBoxWindow,) {
    const pipWindow = await documentPictureInPicture.requestWindow();
    pipWindow?.height = winBoxWindow?.height;
    pipWindow?.width = winBoxWindow?.width;
    pipWindow?.top = winBoxWindow?.top;
    pipWindow?.left = winBoxWindow?.left;
    pipWindow.addEventListener('pagehide', () => {
        openNewWindow(winBoxWindow);
    });

    if(url){
        pipWindow.document.location = url;
    } else if(html){
        pipWindow.document.body.innerHTML = html;
    }
}
async function openNewWindow(winboxObject,configObject){
    /*
    winboxObject is a JSON object that contains the window's properties, 
    adhering to the normal WinBox.js object structure.

    configObject is a JSON object that contains configuration options for this function.

    This function is a wrapper for the WinBox.js library that allows for the opening of a new window 
    with extra buttons and functionality. So we can update this function to include any extra features,
    without having to change the rest of the codebase.

    By default, all features are enabled, but can be disabled by setting the value to false in the configObject.
    For example, if you want to disable the picture-in-picture feature, you can set configObject.pip = false.
    List of features:
    - Picture-in-picture (pip)
    */
    // Get icon folder
    let iconFolder = window.directory.user.getDirectoryHandle("share");
    iconFolder = await iconFolder.getDirectoryHandle("winbox_icons");

    let newWindow = new WinBox(winboxObject);
    
    if(configObject?.pip !== false && "documentPictureInPicture" in window){
        let pipon = iconFolder.getFileHandle("picture_in_picture.png");
        pipon = await pipon.getFile();
        newWindow.addControl({
           index: 0,
           class: "wb-custom",
           image: URL.createObjectURL(pipon),
            click: function(){
                pipWindow(winboxObject.url,winboxObject.html,winboxObject);
            }
        });
    }
}