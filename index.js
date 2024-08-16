const installShortcut = addEventListener('keydown', async (event) => {
    if(event.key === 'i'){
        let opfsRoot,sw;
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

        
    }
});