async function pipWindow(winBoxWindow) {
    const pipWindow = await documentPictureInPicture.requestWindow({
        width: winBoxWindow.width,
        height: winBoxWindow.height,
    });

    pipWindow.addEventListener('pagehide', () => {
        winBoxWindow.show();
    });

    pipWindow.document.body.innerHTML = winBoxWindow.body.innerHTML;
    // Create new style element
    const style = document.createElement('style');
    style.innerHTML = `
    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        display: block;
    }
    `;
    pipWindow.document.head.appendChild(style);
    winBoxWindow.hide();
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

    let newWindow = new WinBox(winboxObject);
    
    if(configObject?.pip !== false && "documentPictureInPicture" in window){
        newWindow.addControl({
           index: 0,
           class: "wb-custom",
           image: window.location.href + "root/user/share/winbox_icons/picture_in_picture.png",
            click: function(){
                console.log("PIP");
                pipWindow(newWindow);
            }
        });
    }
}