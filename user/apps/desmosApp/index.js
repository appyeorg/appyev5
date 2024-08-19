async function openDesmosGUI() {
    let googleIcon = await window.directory.apps.googleApp.getFileHandle("icon.ico", { create: false });
    googleIcon = await googleIcon.getFile();


    new WinBox({
        title: "Desmos",
        icon: URL.createObjectURL(googleIcon),
        class: "appye-window",
        background: "#588fe8",
        x: "center",
        y: "center",
        url: "https://www.desmos.com/calculator",
    })

}

openDesmosGUI();
