async function loadListApp() {
    const fs = await navigator.storage.getDirectory();
    let myAppDir, dataDir;

    try {
        myAppDir = await window.directory.apps.global.getDirectoryHandle("listApps");
        dataDir = await myAppDir.getDirectoryHandle("data");
    } catch (e) {
        console.error(`ERROR: Could not locate required directories. Please ensure that Appye is installed correctly.`);
        return;
    }

    let missingIcon, cssData;
    try {
        let missingIconFile = await dataDir.getFileHandle("missingIcon.png", { create: false });
        missingIcon = await missingIconFile.getFile();
        missingIcon = URL.createObjectURL(missingIcon); // Correctly create a URL for the missing icon
        let cssDataFile = await dataDir.getFileHandle("index.css", { create: false });
        cssData = await cssDataFile.getFile();
        cssData = await cssData.text();
    } catch (e) {
        console.error(`ERROR: Could not load required files. Please ensure that Appye is installed correctly, and that the listApps app has not `);
    }

    let htmlDiv = document.createElement("div");

    let cssStyle = document.createElement("link");
    cssStyle.rel = "stylesheet";
    // Correctly create a URL for the CSS blob
    let cssBlob = new Blob([cssData], { type: "text/css" });
    cssStyle.href = URL.createObjectURL(cssBlob);
    htmlDiv.appendChild(cssStyle);

    let gridDiv = document.createElement("div");
    gridDiv.className = "appgrid";
    gridDiv.id = "apps";

    for (let currentApp in window.appIndex) {
        let appHtml = document.createElement("div");
        appHtml.setAttribute('onclick', `window.parent.openApp("${currentApp}")`);
        appHtml.className = "app";
        appHtml.id = currentApp;
        let appName = document.createElement("h2")
        appName.textContent = window.appIndex[currentApp].name;
        appHtml.appendChild(appName);
        let description = document.createElement("p");
        description.textContent = window.appIndex[currentApp].description;
        description.style.wordBreak = "break-word";
        appHtml.appendChild(description);
        let icon = document.createElement("img");
        // Set the icon to fit the app grid
        icon.style.width = "50%";
        icon.style.height = "50%";
        let currentAppDir = await  window.directory.apps.global.getDirectoryHandle(currentApp);

        if (!window.appIndex[currentApp].icon) {
            console.log(`WARNING: App ${currentApp} does not have an icon. Using default icon instead.`)
            icon.src = missingIcon;
        } else {
            console.log(`App ${currentApp} has an icon. Loading ${window.appIndex[currentApp].icon}...`)
            try {
                let iconFile = await currentAppDir.getFileHandle(window.appIndex[currentApp].icon, { create: false });
                iconFile = await iconFile.getFile();
                icon.src = URL.createObjectURL(iconFile);
            } catch (e) {
                console.error(`ERROR: Could not load icon for app ${currentApp}. Using default icon instead.`);
                icon.src = missingIcon;
            }
        }

        icon.alt = `App icon for ${window.appIndex[currentApp].name}`;
        appHtml.appendChild(icon);
        gridDiv.appendChild(appHtml);
    }

    htmlDiv.appendChild(gridDiv);

    new WinBox({
        title: "List of Apps",
        class: "appye-window",
        background: "#588fe8",
        x: "center",
        y: "center",
        url: URL.createObjectURL(new Blob([htmlDiv.outerHTML], { type: "text/html" })),
    })
}

loadListApp();