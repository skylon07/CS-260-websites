async function loadHtmlJs(moduleName, toElement) {
    if (typeof toElement === "string") {
        toElement = document.getElementById(toElement)
    }
    const htmlPath = `${moduleName}.html`
    await loadHtml(htmlPath, toElement)
    
    const jsPath = `${moduleName}.js`
    await loadJs(jsPath)
}

async function loadHtml(htmlPath, toElement) {
    const htmlResponse = await fetch(htmlPath)
    const htmlElementText = await htmlResponse.text()
    toElement.innerHTML = htmlElementText
}

async function loadJs(jsPath) {
    const jsResponse = await fetch(jsPath)
    const jsFile = await jsResponse.text()
    eval(jsFile)
}
