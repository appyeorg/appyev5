self.addEventListener('install', event => {
    // Perform install steps
    console.log('Service Worker installing.');
  });
  
  self.addEventListener('activate', event => {
    console.log('Service Worker activated.');
  });
  
  self.addEventListener('fetch', event => {
    if(event.request.url.includes('/root/')){
        event.respondWith(
            handleRootRequestFromOPFS(event.request)
        );
    } else {
        event.respondWith(fetch(event.request));
    }
  });

  async function handleRootRequestFromOPFS(request) {
    try {
        const fs = await navigator.storage.getDirectory();
        let url = new URL(request.url);
        let path = url.pathname;
        // Get everything after /root/
        path = path.substring(path.indexOf('/root/') + 6);
        console.log(`INFO: Requested path: ${path}`);
        
        // Split the path into parts
        let parts = path.split('/');
        
        // Traverse the path
        let currentDir = fs;
        for (let i = 0; i < parts.length - 1; i++) {
            currentDir = await currentDir.getDirectoryHandle(parts[i]);
        }
        
        // Get the file handle
        let fileHandle = await currentDir.getFileHandle(parts[parts.length - 1]);
        let file = await fileHandle.getFile();
        
        let response = new Response(file, {
            headers: {
                'Content-Type': file.type
            }
        });
        return response;
    } catch (e) {
        let response = new Response(`Unable to find file at path ${path}, full error is ${e}`, {
            status: 404,
            statusText: 'Not Found'
        });
        return response;
    }
}