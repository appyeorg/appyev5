async function rewriteFile(textContent, currentFS, config) {
    let parser = new DOMParser();
    // The regex are from hogan on StackOverflow
    // https://stackoverflow.com/questions/30764166/detect-if-source-is-css-html-javascript
    let htmlRegex = /<(br|basefont|hr|input|source|frame|param|area|meta|!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big|blockquote|body|button|canvas|caption|center|cite|code|colgroup|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frameset|head|header|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\/\\2/;
    let cssRegex = /(?:^\s*)([\w#.@*,:\-.:>,*\s]+)\s*{(?:[\s]*)(?:(?:[A-Za-z\- \s]+[:]\s*['"0-9\w .,\/()\-!%]+;?)*)\s*}(?:\s*)/gm;

    let vaildTypes = ["html", "css", "js", "auto"]
    if(!config) {
        config = {
            "type": "auto",
            "auto-replace-js": false,
            "auto-replace-css": false,
            "auto-replace-html": true,
            "replace-rules-html": {
                "href=" : "hreftmp=",
                "src=": "srctmp=",
                "data=": "datatmp="
            },
            "replace-nodes-html": {
                "a": "href",
                "img": "src",
                "link": "href",
                "script": "src",
                "area": "href",
                "base": "href",
                "object": "data",
                "video": "src",
                "audio": "src",
            }

        }
    }

    if(!vaildTypes.includes(config.type)){
        console.log("WARNING: Invalid type specified. Defaulting to auto.")
        config.type = "auto"
    }

    if(!config["auto-replace-js"]){
        config["auto-replace-js"] = false
    }

    if(!config["auto-replace-css"]){
        config["auto-replace-css"] = false
    }

    if(!config["auto-replace-html"]){
        config["auto-replace-html"] = true
    }

    if(!config["replace-rules-html"]){
        config["replace-rules-html"] = {
            "herf=": "hreftmp=",
            "src=": "srctmp=",
            "data=": "datatmp="
        }
    }

    if(!config["replace-nodes-html"]){
        config["replace-nodes-html"] = {
            "a": "href",
            "img": "src",
            "link": "href",
            "script": "src",
            "area": "href",
            "base": "href",
            "object": "data",
            "form": "action",
            "video": "src",
            "audio": "src",
        }
    }

    //If textContent is filesystem object, get the text.
    if(textContent instanceof FileSystemFileHandle){
        let file = await textContent.getFile();
        textContent = await file.text();
    }

    if(config.type = "auto"){
        if(textContent.match(htmlRegex)){
            console.log("INFO: This looks like HTML... " + textContent)
            config.type = "html"
        } else if (textContent.match(cssRegex)){
            console.log("INFO: This looks like CSS... " + textContent)
            config.type = "css"
        } else {
            console.log("INFO: This looks like JS... " + textContent)
            config.type = "js"
        }
    }

    if (config.type == "html") {
        // Iterate over the replacement rules.
        for (let rule in config["replace-rules-html"]) {
            // This regex looks for the rule that's not followed by an even number of quotes till the end of the string.
            let regex = new RegExp(rule + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g');
            // Replace using the modified regex.
            textContent = textContent.replace(regex, function(match) {
                return config["replace-rules-html"][rule];
            });
        }
        console.log("INFO: Replaced HTML using rules. " + textContent);

        // Now that we've replaced the HTML, we can parse it and modify it.
        let doc = parser.parseFromString(textContent, "text/html");

        // filter the elements from the config.
        let tags = doc.querySelectorAll(Object.keys(config["replace-nodes-html"]).join(","));

        console.log("INFO: Found tags to replace. ", tags);
        
        //The URL we need to replace with a blob loaded from currentFS.
        //URL is in attributes:NamedNodeMap
        for(let tag of tags){
            let attributes = tag.attributes;
            for(let attribute of attributes){
                if(config["replace-nodes-html"][tag.tagName.toLowerCase()] == attribute.name.replace("tmp","")){
                    console.log("INFO: Found attribute to replace. ", attribute, tag);
                    // Traverse the file system to find the file.
                    let traverseFS = currentFS;
                    try {
                        // Split the path by the separator.
                        let fileParts = attribute.value.split("/");
                        // Remove the last part
                        let fileName = fileParts.pop();
                        // Traverse the file system.
                        for (let filePart of fileParts) {
                            try {
                                traverseFS = await traverseFS.getDirectoryHandle(filePart, { create: true });
                            } catch(e){
                                console.log("ERROR: Could not get to ", filePart, e);
                            }
                        }

                        // Get the file handle.
                        let fileHandle = await traverseFS.getFileHandle(fileName, { create: true });
                        // Get the file.
                        let file = await fileHandle.getFile();

                        if(attribute.value.endsWith('.js') && config["auto-replace-js"] == true){
                            textOutput = await rewriteFile(await file.text(), currentFS, config);
                            file = new Blob([textOutput], { type: "application/javascript" });
                        } else if (attribute.value.endsWith('.css') && config["auto-replace-css"] == true){
                            textOutput = await rewriteFile(await file.text(), currentFS, config);
                            file = new Blob([textOutput], { type: "text/css" });
                        }

                        if(file && file.size > 0){
                            attribute.value = URL.createObjectURL(file);
                        }

                    } catch(e){
                        console.log("ERROR: Could not traverse the file system. ", e);
                    }
                }
            }
        }
        console.log("INFO: Replaced HTML tags. ", doc);
        //Unreplace the rules.
        textContent =doc.documentElement.outerHTML;
        for (let rule in config["replace-rules-html"]) {
            // This regex looks for the rule that's not followed by an even number of quotes till the end of the string.
            let regex = new RegExp(config["replace-rules-html"][rule] + '(?=(?:[^"]*"[^"]*")*[^"]*$)', 'g');
            // Replace using the modified regex.
            textContent = textContent.replace(regex, function(match) {
                return rule;
            });
        }

        return textContent;
    }
    return textContent;
}