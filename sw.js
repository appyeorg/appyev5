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

async function handleRootRequestFromOPFS(request){
    try {
        const fs = await navigator.storage.getDirectory();
        let url = new URL(request.url);
        let path = url.pathname;
        // Get everything after /root/
        path = path.substring(path.indexOf('/root/') + 6);
        console.log(`INFO: Requested path: ${path}`);
        let file = await fs.getFileHandle(path, { create: false });
        let fileContents = await file.getFile();
        let response = new Response(fileContents, {
            headers: {
                'Content-Type': fileContents.type
            }
        });
        return response;
    } catch(e){
        let response = new Response('File not found', {
            status: 404,
            statusText: 'Not Found'
        });
        return response;
    }
}