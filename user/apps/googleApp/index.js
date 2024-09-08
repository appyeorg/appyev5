async function openGoogleGUI() {
    let googleIcon = await window.directory.apps.googleApp.getFileHandle("icon.ico", { create: false });
    googleIcon = await googleIcon.getFile();


    let winboxObject ={
        title: "Google",
        icon: URL.createObjectURL(googleIcon),
        class: "appye-window",
        background: "#588fe8",
        x: "center",
        y: "center",
        url: "https://www.google.com?igu=1",
    }
    openNewWindow(winboxObject);

}

openGoogleGUI();
