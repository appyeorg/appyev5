async function pipWindow(url,html,winBoxWindow,) {
    const pipWindow = await documentPictureInPicture.requestWindow();
    pipWindow.addEventListener('pagehide', () => {
        winBoxWindow.show();
    });
    pipWindow.document.body = winBoxWindow.body;
    pipWindow.document.head = winBoxWindow.head;
    pipWindow.document.title = winBoxWindow.title;
    // Copy favicon
    if(winBoxWindow.icon){
        let icon = document.createElement("link");
        icon.rel = "icon";
        icon.href = winBoxWindow.icon;
        pipWindow.document.head.appendChild(icon);
    }
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
                pipWindow(winboxObject.url,winboxObject.html,winboxObject);
            }
        });
    }
}