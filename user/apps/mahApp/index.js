async function openMahGUI(){
    // Create URL for mahApp/assets/index.html
    let mahIndex = window.location.href + "root/user/apps/mahApp/assets/index.html";

    let appIcon = await window.directory.apps.mahApp.getFileHandle("icon.png", { create: false });
    appIcon = await appIcon.getFile();

    new WinBox({
        title: "Mah",
        icon: URL.createObjectURL(appIcon),
        class: "appye-window",
        background: "#F7BE76",
        x: "center",
        y: "center",
        url: mahIndex,
    })
}

openMahGUI();