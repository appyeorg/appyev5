async function installAppGUI() {
//Get index.css from data
let dataFolder = await window.directory.apps.appInstall.getDirectoryHandle("data", { create: false });
let cssData = await window.directory.share.getFileHandle("appye-page.css", { create: false });
cssData = await cssData.getFile();
cssData = await cssData.text();

let htmlData = await dataFolder.getFileHandle("index.html", { create: false });
htmlData = await htmlData.getFile();
htmlData = await htmlData.text();

let jsData = await dataFolder.getFileHandle("index.js", { create: false });
jsData = await jsData.getFile();
jsData = await jsData.text();

let jsZipData = await dataFolder.getFileHandle("jszip.min.js", { create: false });
jsZipData = await jsZipData.getFile();
jsZipData = await jsZipData.text();

let htmlDiv = document.createElement("div");

let cssStyle = document.createElement("link");
cssStyle.rel = "stylesheet";
let cssBlob = new Blob([cssData], { type: "text/css" });
cssStyle.href = URL.createObjectURL(cssBlob);
htmlDiv.appendChild(cssStyle);

let jsZipScript = document.createElement("script");
let jsZipBlob = new Blob([jsZipData], { type: "text/javascript" });
jsZipScript.src = URL.createObjectURL(jsZipBlob);
htmlDiv.appendChild(jsZipScript);

let jsScript = document.createElement("script");
let jsBlob = new Blob([jsData], { type: "text/javascript" });
jsScript.src = URL.createObjectURL(jsBlob);
htmlDiv.appendChild(jsScript);

htmlDiv.innerHTML += htmlData;

let appIcon = await window.directory.apps.appInstall.getFileHandle("icon.png", { create: false });
appIcon = await appIcon.getFile();

let winboxObject ={
    title: "App Installer",
    icon: URL.createObjectURL(appIcon),
    class: "appye-window",
    background: "#588fe8",
    x: "center",
    y: "center",
    url: URL.createObjectURL(new Blob([htmlDiv.outerHTML], { type: "text/html" })),
}
openNewWindow(winboxObject,{pip:false});

}

installAppGUI();