async function openDesmosGUI() {
    let desmosIcon = await window.directory.apps.desmosApp.getFileHandle("icon.ico", { create: false });
    desmosIcon = await desmosIcon.getFile();


    new WinBox({
        title: "Desmos",
        icon: URL.createObjectURL(desmosIcon),
        class: "appye-window",
        background: "#588fe8",
        x: "center",
        y: "center",
        url: "https://www.desmos.com/calculator",
    })

}

openDesmosGUI();
