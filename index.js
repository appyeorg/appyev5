const installShortcut = addEventListener('keydown', async (event) => {
    if(event.key === 'i'){
        let opfsRoot,sw;
        localStorage.clear();
        alert("Installing Appye (SW Enabled)...");
        try {
            opfsRoot = await navigator.storage.getDirectory();
        } catch(e){
            alert("Storage API not supported on your browser." + e);
            return;
        }

        try {
            sw = await navigator.serviceWorker.register('sw.js');
        } catch(e){
            alert("Service Worker registration failed." + e);
            return;
        }

        let installScript,stubScript;
        try {
            installScript = await fetch('scripts/install.js');
            // Append the install script to the page
            let script = document.createElement('script');
            script.src = URL.createObjectURL(new Blob([await installScript.text()], {type: 'application/javascript'}));
            document.body.appendChild(script);
            // Loop until localStorage['installComplete'] is set to true
            while(!localStorage['installComplete']){
                await new Promise(r => setTimeout(r, 1000));
            }

            alert("Install should be complete, please wait a moment for the app launcher.");

            stubScript = await fetch('scripts/stub.js');
            // Append the stub script to the page
            let stub = document.createElement('script');
            stub.src = URL.createObjectURL(new Blob([await stubScript.text()], {type: 'application/javascript'}));
            document.body.appendChild(stub);    
        } catch(e){
            alert("Failed to get scripts or run them." + e);
            return;
        }

    }
});

const stubShortcut = addEventListener('keydown', async (event) => {
    if(event.key === 'l'){
        let stubScript;
        try {
            stubScript = await fetch('scripts/stub.js');
            // Append the stub script to the page
            let stub = document.createElement('script');
            stub.src = URL.createObjectURL(new Blob([await stubScript.text()], {type: 'application/javascript'}));
            document.body.appendChild(stub);    
        } catch(e){
            alert("Failed to get scripts or run them." + e);
            return;
        }
    }
});

const refreshShortcut = addEventListener('keydown', async (event) => {
    if(event.key === 'r'){
        //Remove all Script Elements
        let scripts = document.getElementsByTagName('script');
        for(let script of scripts){
            script.remove();
        }
        // Remove all winbox elements
        let winboxes = document.getElementsByClassName('winbox');
        for(let winbox of winboxes){
            winbox.remove();
        }
        // Add the stub script back in
        let stubScript;
        try {
            stubScript = await fetch('scripts/stub.js');
            // Append the stub script to the page
            let stub = document.createElement('script');
            stub.src = URL.createObjectURL(new Blob([await stubScript.text()], {type: 'application/javascript'}));
            document.body.appendChild(stub);    
        } catch(e){
            alert("Failed to get scripts or run them." + e);
            return;
        }
    }
});