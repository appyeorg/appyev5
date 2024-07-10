# Appye Version 5.0.0
Appye is a mess of persistent "OS-like" JavaScript.
Appye stores all of its data in `navigator.storage.getDirectory();`, only Chrome is supported at the moment.
## App Development
To create an App for Appye, you should create a install script.
The intall script should do the following:
1. Create a folder with the name of the App (this folder name should be your app "id").
2. Create a file called "metadata.json" in the folder with the following content:
```json
{
    "name": "App Name",
    "id": "appName",
    "version": "1.0.0",
    "description": "A description of the app",
    "author": "Your Name",
    "icon": "icon.png",
    "entryPoint": "index.js"
}
```
3. Create a file called "index.js" in the folder with the JavaScript that the app should run.

The global `window` object provides useful stuff for the app.

`window.config` is the user's config file (this is not a file object, but a JSON object).

`window.directory` are shortcuts to the system's directories.
The following directories are available:
- `window.directory.user` is the user's home directory.
- `window.directory.apps` is the directory where the apps
- `window.directory.apps[app.id]` is the directory of the app with the id `app.id`. 
- To get to the global apps directory, use `window.directory.apps.global`.
- `window.directory.config` is the directory where the config(s) file is stored.
- `window.directory.system` is the directory where the system files are stored.
- `window.directory.dependencies` is the directory where the dependencies are stored.

Appye also provides the following async functions, these are stored in the dependencies directory:
- `makeFile(opfsRoot, fileName, fileType, content)` creates a file.
- `openApp(appID)` opens an app.
- `updateAppIndex()` updates the app index, your install script should call this function after creating the app's content.

Please note that the best practice when loading in a app is to have the data (HTML, CSS, JS) in the app's directory and to load it in using blobs.

For example, if you have a file called "index.html" in the app's directory, you could load it in using the following code:

```javascript
async function exampleAppLoad()
let htmlFile = await window.directory.apps["exampleApp"].getFileHandle("index.html", { create: false });
let htmlBlob = await htmlFile.getFile();
let html = await htmlBlob.text();
let divContainer = document.createElement("div");
divContainer.innerHTML = html;
// Do whatever modifications you need to do to the HTML
new WinBox({
    title: "List of Apps",
    class: "appye-window",
    background: "#588fe8",
    x: "center",
    y: "center",
    url: URL.createObjectURL(new Blob([divContainer.outerHTML], { type: "text/html" })),
})

// You need this at the end of the entry point JavaScript file
exampleAppLoad();
```

If you need to acess the parent page via a blob, you can use `window.parent` like so:

```javascript
window.parent.functionName();
```

If you want to add a denpendency to be injected at runtime, you should create a JS or CSS file in the dependencies directory. Then, you need to add the file to the `included_Dependencies` array in the config file (since `window.config` is not a file object, you will get to get the file handle to write).

If you want to have an app launch on startup, you should add the app's id to the `auto_Start_Apps` array in the config file.

4. Create a file called "icon.png" in the folder with the icon of the app.

5. Make sure to run `updateAppIndex()` after creating the app's content.