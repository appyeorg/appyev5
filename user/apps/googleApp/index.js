async function openGoogleGUI() {
    let googleAppFolder = await window.directory.apps.googleApp;
    let googleIcon = googleAppFolder.getFileHandle("icon.ico", { create: false });
    googleIcon = await googleIcon.getFile();


    new WinBox({
        title: "Google",
        icon: URL.createObjectURL(googleIcon),
        class: "appye-window",
        background: "#588fe8",
        x: "center",
        y: "center",
        url: "https://www.google.com?igu=1",
    })

}

openGoogleGUI();
