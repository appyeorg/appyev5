const fs = await navigator.storage.getDirectory();
let userDir = await fs.getDirectoryHandle("user");
let appDir = await userDir.getDirectoryHandle("apps");
let myAppDir = await appDir.getDirectoryHandle("listApps");
let dataDir = await myAppDir.getDirectoryHandle("data");

let cssData = await dataDir.getFileHandle("index.css", { create: false });
cssData = await cssData.getFile();
cssData = await cssData.text();

let htmlDiv = document.createElement("div");

let cssStyle = document.createElement("link");
cssStyle.rel = "stylesheet";
cssStyle.href = new Blob([cssData], { type: "text/css" });
htmlDiv.appendChild(cssStyle);

let gridDiv = document.createElement("div");
gridDiv.className = "appgrid";
gridDiv.id = "apps";

for(let currentApp in window.appIndex){
    let appHtml = document.createElement("div");
    appHtml.setAttribute('onclick',`openApp("${currentApp}")`);
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
    let currentAppDir = await appDir.getDirectoryHandle(currentApp);
    let iconFile = await currentAppDir.getFileHandle(window.appIndex[currentApp].icon, { create: false });
    iconFile = await iconFile.getFile();
    icon.src = URL.createObjectURL(iconFile);
    icon.alt = `App icon for ${appIndex[currentApp].name}`;
    appHtml.appendChild(icon);
    gridDiv.appendChild(appHtml);
}

htmlDiv.appendChild(gridDiv);

new WinBox({
    title: "List of Apps",
    background: "#588fe8",
    x: "center",
    y: "center",
    url: URL.createObjectURL(new Blob([htmlDiv.outerHTML], { type: "text/html" })),
})


